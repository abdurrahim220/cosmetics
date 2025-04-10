import ejs from "ejs";
import { User } from "../../module/user/user.model";
import { config } from "../../config";
import { sendEmail } from "../../utils/sendEmail";

const sendWelcomeEmail = async () => {
  const users = await User.find({ status: 0 });
  if (users.length > 0) {
    for (const user of users) {
      ejs.renderFile(
        "templates/welcome.ejs",
        { name: user.name },
        async (err, data) => {
          const messageOptions = {
            from: config.EMAIL_USER,
            to: user.email,
            subject: "Welcome to Our Service",
            html: data,
          };
          try {
            await sendEmail(messageOptions);
            await User.findByIdAndUpdate(user._id, {
              status: 1,
            });
            console.log("Email sent to", user.name);
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      );
    }
  }
};

export default sendWelcomeEmail;
