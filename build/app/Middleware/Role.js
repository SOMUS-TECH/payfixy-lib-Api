"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Role {
    async handle({ auth, response }, next, allowedRoles) {
        const user = auth.user;
        if (!user || !allowedRoles.includes(user.type)) {
            return response.unauthorized({ message: 'Access denied' });
        }
        await next();
    }
}
exports.default = Role;
//# sourceMappingURL=Role.js.map