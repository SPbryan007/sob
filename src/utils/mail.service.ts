import { Injectable } from '@nestjs/common';
import * as _mailer from 'nodemailer';
import { ConfigService } from 'src/config/config.service';
import { Configuration } from 'src/config/config.keys';
import * as html_to_pdf from 'html-pdf-node';

@Injectable()
export class MailerService {
  private transporter: any;
  constructor(private readonly _configService: ConfigService) {
    this.transporter = _mailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      //service: this._configService.get(Configuration.MAILER_SERVICE),
      auth: {
        user: this._configService.get(Configuration.USER_MAIL),
        pass: this._configService.get(Configuration.PASSWORD_MAIL),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  async sendPDF(mail: string, pdf: Buffer) {
    try {
      const sent = await this.transporter.sendMail({
        from: 'transbustillo@outlook.com',
        to: mail,
        subject: 'Codigo de Verificacion',
        body: 'email de prueba',
        attachments: [{ filename: 'hola.pdf', content: pdf }],
        // html: `Su codigo de verificacion es <strong><h3>${otp}</h3></strong>`,
      });
      console.log(sent);

      return sent;
    } catch (error) {
      console.log('send email error', error);
    }
  }
  async sendMailVericationCode(
    otp: any,
    email: string,
    msg?: string,
  ): Promise<any> {
    try {
      const sent = await this.transporter.sendMail({
        from: 'transbustillo@outlook.com',
        to: email,
        subject: 'Codigo de Verificacion',
        body: msg,
        html: `${msg}<strong><h3>${otp}</h3></strong>`,
      });
      console.log(sent);

      return sent;
    } catch (error) {
      console.log('send email error', error);
    }
  }
  async sendMailTickets(data: any[], email: string): Promise<any> {
    let row = ``;
    console.log('data viaje.........',data);
    
    data.forEach((item) => {
      row += `<div class="row">
      <article class="card">
        <section class="date">
          <time datetime="23th feb">
            <span>${item.seat}</span><span>Asiento / Seat</span>
          </time>
        </section>
        <section class="card-cont">
          <small>Trans. Bustillo</small>
          <h3>${item.route}</h3>
          <h4>${item.code_trip}</h4>
          <br />
          <hr />
          <div class="even-date" style="text-align: left;">
            <i class="fa fa-calendar"></i>
            <time>
              <span
                >Fecha de salida / Departure date :
                <strong style="color: #037fdd;">${item.departure_date}</strong></span
              >
              <span
                >Hora de salida / Depature time :
                <strong style="color: #037fdd;"> ${item.departure_time}</strong>
              </span>
              <span
                >Pasaje / Ticket :
                <strong style="color: teal;"> ${item.code}</strong>
              </span>
              <span
                >Carril de salida/Platform :
                <strong>${item.carril}</strong>
              </span>
              <span
                >Pasajero / Passenger :
                <strong>${item.passenger}</strong>
              </span>
              <span
                >CI/DNI/PASAPORTE :
                <strong> ${item.document}</strong>
              </span>
            </time>
          </div>
          <div class="even-info">
            
          </div>
          <!-- <a href="#">tickets</a> -->
        </section>
      </article>
    </div>`;
    });
    console.log('row....................',row);
    
    const html = `<!DOCTYPE html>
     <html lang="es">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Ticket</title>
         <style>
           @import url('https://fonts.googleapis.com/css?family=Oswald');
           * {
             margin: 0;
             padding: 0;
             border: 0;
             box-sizing: border-box;
           }
     
           body {
             background-color: #dadde6;
             font-family: arial;
           }
     
           .fl-left {
             float: left;
           }
     
           .fl-right {
             float: right;
           }
     
           .container {
             width: 90%;
             margin: 100px auto;
           }
     
           h1 {
             text-transform: uppercase;
             font-weight: 900;
             padding-bottom: 10px;
             padding-left: 10px;
             margin-bottom: 30px;
           }
     
           .row {
             overflow: hidden;
           }
     
           .card {
             display: table-row;
             width: 49%;
             background-color: #fff;
             color: #989898;
             margin-bottom: 10px;
             font-family: 'Oswald', sans-serif;
             text-transform: uppercase;
             border-radius: 4px;
             position: relative;
           }
     
           .card + .card {
             margin-left: 2%;
           }
     
           .date {
             display: table-cell;
             width: 25%;
             position: relative;
             text-align: center;
             border-right: 2px dashed #dadde6;
           }
     
           .date:before,
           .date:after {
             content: '';
             display: block;
             width: 30px;
             height: 30px;
             background-color: #dadde6;
             position: absolute;
             top: -15px;
             right: -15px;
             z-index: 1;
             border-radius: 50%;
           }
     
           .date:after {
             top: auto;
             bottom: -15px;
           }
     
           .date time {
             display: block;
             position: absolute;
             top: 50%;
             left: 50%;
             -webkit-transform: translate(-50%, -50%);
             -ms-transform: translate(-50%, -50%);
             transform: translate(-50%, -50%);
           }
     
           .date time span {
             display: block;
           }
     
           .date time span:first-child {
             color: #2b2b2b;
             font-weight: 600;
             font-size: 250%;
           }
     
           .date time span:last-child {
             text-transform: uppercase;
             font-weight: 600;
             margin-top: -10px;
           }
     
           .card-cont {
             display: table-cell;
             width: 75%;
             font-size: 85%;
             padding: 10px 10px 30px 50px;
           }
     
           .card-cont h3 {
             color: #3c3c3c;
             font-size: 130%;
           }
     
           /* .row:last-child .card:last-of-type .card-cont h3
           {
             text-decoration: line-through
           } */
     
           /* .card-cont > div {
             display: table-row;
           } */
     
           .card-cont .even-date i,
           .card-cont .even-info i,
           .card-cont .even-date time,
           .card-cont .even-info p {
             display: table-cell;
           }
     
           .card-cont .even-date i,
           .card-cont .even-info i {
             padding: 5% 5% 0 0;
           }
     
           .card-cont .even-info p {
             padding: 30px 50px 0 0;
           }
     
           .card-cont .even-date time span {
             display: block;
           }
     
           .card-cont a {
             display: block;
             text-decoration: none;
             width: 80px;
             height: 30px;
             background-color: #d8dde0;
             color: #fff;
             text-align: center;
             line-height: 30px;
             border-radius: 2px;
             position: absolute;
             right: 10px;
             bottom: 10px;
           }
     
           .row:last-child .card:first-child .card-cont a {
             background-color: #037fdd;
           }
     
           .row:last-child .card:last-child .card-cont a {
             background-color: #f8504c;
           }
     
           @media screen and (max-width: 860px) {
             .card {
               display: block;
               float: none;
               width: 100%;
               margin-bottom: 10px;
             }
     
             .card + .card {
               margin-left: 0;
             }
     
             .card-cont .even-date,
             .card-cont .even-info {
               font-size: 75%;
               text-align: left;
             }
           }
         </style>
       </head>
       <body>
         <section class="container">
           <center>
             <h1>Pasajes</h1>
            ${row}
           </center>
         </section>
       </body>
     </html>
     `;

    try {
      let options = { format: 'A4' };
      let file = { content: html };
      //let sent: any;
      //const pdfBuffer = await html_to_pdf.generatePdf(file,options);
      // html_to_pdf.generatePdf(file, options).then(async (pdfBuffer) => {
      //   let sent = await this.transporter.sendMail({
      //     from: 'transbustillo@outlook.com',
      //     to: email,
      //     subject: 'Pasajes',
      //     body:
      //       'Estos son tus pasajes para tu viaje recuerda imprimirlos y llevarlos contigo',
      //     attachments: [{ filename: 'mis_pasajes.pdf', content: pdfBuffer }],
      //   });
      // });
      let sent = await this.transporter.sendMail({
        from: 'transbustillo@outlook.com',
        to: email,
        subject: 'Pasajes',
        html:html,
        body:
          'Estos son tus pasajes para tu viaje recuerda imprimirlos y llevarlos contigo',
       // attachments: [{ filename: 'mis_pasajes.pdf', content: pdfBuffer }],
      });
      return sent;
    } catch (error) {
      console.log('send email tickets error', error);
    }
  }
}
