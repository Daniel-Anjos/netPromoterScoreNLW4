import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
    private client: Transporter
    constructor() {
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
            });
            this.client = transporter;
        });
    }

    //Envio de Email
    async execute(to: string, subject: string, variables: object, path: string) {
        //Utilizando o filesystem para a leitura do arquivo
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const mailTemplateParse = handlebars.compile(templateFileContent);
        const html = mailTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS<noreply@handit.com.br>"
        })
        console.log(`Message sent: ${message.messageId}`,);
        //Preview disponível apenas quando o envio for com uma conta Etheral
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)
    }
}

export default new SendMailService();