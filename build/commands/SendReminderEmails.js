"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
const Checkout_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Checkout"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const luxon_1 = require("luxon");
class SendReminderEmails extends standalone_1.BaseCommand {
    async run() {
        const twoDaysFromNow = luxon_1.DateTime.now().plus({ days: 2 }).startOf('day');
        const tomorrow = luxon_1.DateTime.now().plus({ days: 3 }).startOf('day');
        const checkouts = await Checkout_1.default.query()
            .where('notified_before_due', false)
            .whereBetween('expected_checkin_date', [twoDaysFromNow.toSQL(), tomorrow.toSQL()])
            .preload('user')
            .preload('book');
        for (const checkout of checkouts) {
            try {
                await Mail_1.default.send((message) => {
                    message
                        .to(checkout.user.email)
                        .from('barrbarabanks@gmail.com')
                        .subject('Reminder: Book Return Due Soon')
                        .htmlView('emails/reminder', {
                        user: checkout.user,
                        book: checkout.book,
                        dueDate: checkout.expectedCheckinDate,
                    });
                });
                checkout.notifiedBeforeDue = true;
                await checkout.save();
                this.logger.info(`Reminder sent to ${checkout.user.email}`);
            }
            catch (err) {
                this.logger.error(`❌ Failed to send reminder to ${checkout.user.email}: ${err.message}`);
            }
        }
        const todays = luxon_1.DateTime.now().startOf('day');
        const overdueCheckouts = await Checkout_1.default.query()
            .whereNull('checkinDate')
            .andWhere('expectedCheckinDate', '<', todays.toSQLDate())
            .andWhere('overdueNotified', false)
            .preload('book')
            .preload('user');
        const librarian = await User_1.default.query().where('type', 'librarian').first();
        for (const checkout of overdueCheckouts) {
            try {
                await Mail_1.default.send((message) => {
                    message
                        .to(librarian.email)
                        .from('noreply@payfixy.com')
                        .subject('Overdue Book Alert')
                        .htmlView('emails/overdue', {
                        checkout,
                        book: checkout.book,
                        user: checkout.user,
                    });
                });
                checkout.overdueNotified = true;
                await checkout.save();
            }
            catch (error) {
                console.error('Overdue notification failed:', error);
            }
        }
    }
}
SendReminderEmails.commandName = 'emails:remind-checkins';
SendReminderEmails.description = 'Send email reminders for books due in 2 days';
SendReminderEmails.settings = {
    loadApp: false,
    stayAlive: false,
};
exports.default = SendReminderEmails;
//# sourceMappingURL=SendReminderEmails.js.map