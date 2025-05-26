"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const crypto_1 = __importDefault(require("crypto"));
const luxon_1 = require("luxon");
cloudinary_1.v2.config({
    cloud_name: Env_1.default.get('CLOUDINARY_CLOUD_NAME'),
    api_key: Env_1.default.get('CLOUDINARY_API_KEY'),
    api_secret: Env_1.default.get('CLOUDINARY_API_SECRET'),
});
class AuthController {
    async register({ request, auth, response }) {
        const validation = Validator_1.schema.create({
            first_name: Validator_1.schema.string(),
            last_name: Validator_1.schema.string(),
            email: Validator_1.schema.string({}, [Validator_1.rules.email(), Validator_1.rules.unique({ table: 'users', column: 'email' })]),
            password: Validator_1.schema.string({}, [Validator_1.rules.minLength(6)]),
            type: Validator_1.schema.enum(['reader', 'librarian']),
            photo: Validator_1.schema.file.optional({
                size: '2mb',
                extnames: ['jpg', 'jpeg', 'png'],
            }),
        });
        const data = await request.validate({ schema: validation });
        const user = new User_1.default();
        user.fill(data);
        user.emailVerified = false;
        user.verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        user.verificationTokenExpiry = luxon_1.DateTime.now().plus({ hours: 1 }).toFormat('yyyy-MM-dd HH:mm:ss');
        if (data.photo) {
            const uploaded = await cloudinary_1.v2.uploader.upload(data.photo.tmpPath);
            await promises_1.default.unlink(data.photo.tmpPath);
            user.photo = uploaded.secure_url;
        }
        await user.save();
        await Mail_1.default.send((message) => {
            message
                .to(user.email)
                .from('noreply@payfixy.com')
                .subject('Verify Your Email')
                .htmlView('emails/verification', { user });
        });
        const token = await auth.use('api').generate(user);
        return response.created({ user, token });
    }
    async verify({ request, response }) {
        const { token } = request.only(['token']);
        const user = await User_1.default.query()
            .where('verificationToken', token)
            .andWhere('verificationTokenExpiry', '>', luxon_1.DateTime.now().toSQL())
            .first();
        if (!user) {
            return response.badRequest({ message: 'Invalid token' });
        }
        user.emailVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();
        return response.ok({ message: 'Email verified successfully' });
    }
    async forgotPassword({ request, response }) {
        const { email } = request.only(['email']);
        const user = await User_1.default.findByOrFail('email', email);
        user.resetToken = crypto_1.default.randomBytes(32).toString('hex');
        user.resetTokenExpiry = luxon_1.DateTime.now().plus({ minutes: 30 }).toFormat('yyyy-MM-dd HH:mm:ss');
        await user.save();
        await Mail_1.default.send((message) => {
            message
                .to(user.email)
                .from('barrbarabanks@gmail.com')
                .subject('Reset Your Password')
                .htmlView('emails/passwordreset', { user });
        });
        return response.ok({ message: 'Reset email sent' });
    }
    async resetPassword({ request, response }) {
        const { token, password } = request.only(['token', 'password']);
        const user = await User_1.default.query().where('resetToken', token).first();
        if (!user) {
            return response.badRequest({ message: 'Invalid token' });
        }
        if (!user.resetTokenExpiry || luxon_1.DateTime.fromSQL(user.resetTokenExpiry).diffNow('minutes').minutes <= 0) {
            return response.badRequest({ message: 'Token expired' });
        }
        user.password = password;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        return response.ok({ message: 'Password reset successfully' });
    }
    async changePassword({ auth, request, response }) {
        const user = auth.user;
        const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword']);
        if (!(await Hash_1.default.verify(user.password, currentPassword))) {
            return response.badRequest({ message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        return response.ok({ message: 'Password changed successfully' });
    }
    async login({ request, auth, response }) {
        const { email, password } = request.only(['email', 'password']);
        const user = await User_1.default.query().where('email', email).firstOrFail();
        if (!(await Hash_1.default.verify(user.password, password))) {
            return response.unauthorized('Invalid credentials');
        }
        if (!user.emailVerified) {
            return response.unauthorized('Please verify your email');
        }
        const token = await auth.use('api').generate(user);
        return response.ok({ user, token });
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map