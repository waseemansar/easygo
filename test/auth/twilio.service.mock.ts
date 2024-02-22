export class TwilioServiceMock {
    async sendVerificationCode() {}

    async verifyCode() {
        return true;
    }
}
