import wppconnect from "@wppconnect-team/wppconnect";
import axios from "axios";
import { JSDOM } from "jsdom";
import dotenv from'dotenv';
dotenv.config();

let whatsappclient;
const apiKey = process.env.API_KEY;
async function sendMessage(message) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      { contents: [{ parts: [{ text: message }] }] },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.candidates[0].content.parts[0].text);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log(error);
  }
}

async function startWPP() {
  await wppconnect
    .create({
      session: "IoTLab",
      catchQR: (base64Qr, asciiQR, attempts, urlCode) => {},
      statusFind: (statusSession, session) => {
        console.log("Status Session: ", statusSession);
        console.log("Session name: ", session);
      },
      headless: true,
      devtools: false,
      useChrome: true,
      debug: false,
      logQR: true,
      browserWS: "",
      browserArgs: ["--no-sandbox", "--disable-setuid-sandbox", "--headless"],
      puppeteerOptions: {},
      disableWelcome: true,
      updatesLog: false,
      autoClose: 60000,
      tokenStore: "file",
      folderNameToken: "./tokens",
    })
    .then((client) => {
      start(client);
    })
    .catch((erro) => console.log(erro));
}

async function start(client) {
  whatsappclient = client;
  client.onMessage(async (message) => {
    console.log(message.body);
    console.log(message.type);
    let isAdmin = false;
    if (message.body.startsWith("!find") && message.body.length > 5) {
      let rollnum = message.body.split("!find ")[1];
      console.log(rollnum);
      let url = "https://form.kiit.ac.in/payment/";
      let data = `appno=${rollnum}`;
      let headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "_ga_34QZ5P9757=GS1.1.1738447844.24.1.1738448406.60.0.0; _ga=GA1.3.1502346947.1711135834; _fbp=fb.2.1711306313360.1356282095; cf_clearance=QFQw4RiWw63XkbCGKziP0TKdoNVa4rUQSozkjTJEhPw-1738448496-1.2.1.1-VLZVXLhza9A7_vkEmF2dMRBAmuiRlaSeEuIMHHAmDSTw2a44xZqvsGu159Dhw86UPEZLLFXXx5K98bmCrWVuLN9lI4pcFoO_1g4R5Oi.CBpBfE91VgBJ6QcrKlkxOxgm_ZERHOgxAajD1zPgcEcLDOifHVLHXFKwLZ_PRWZtY6XN7ov82IgHvfh1.ISpPPpAzYxA8S18XX3GRh.yWiBrLd2h.ORvWVUbhi0Jk_BIEmXM8ONkpqgfohurn8bIvRh7S1GDjKNt6PN7Won1B0cWCXtrCE0GV3a7okCPkp6_PVzrT86n.wJLNiB494zmSvbSNgSqFjnRoAzXCK_k9O9vTA; cf_chl_rc_m=20; _gid=GA1.3.5476645.1738447845; PHPSESSID=ifo49f05u7pktj43976kj3273r",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Origin": "https://form.kiit.ac.in",
        "Referer": "https://form.kiit.ac.in/payment/",
        "Upgrade-Insecure-Requests": 1,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Priority": "u=0, i"
      };
      if (rollnum) {
        try {
          let response = await axios.post(url, data, { headers: headers });
          console.log(response);
          const newUrl = response.headers['Location'];
          headers = {
            "Cookie": "_ga_34QZ5P9757=GS1.1.1738447844.24.1.1738448406.60.0.0; _ga=GA1.3.1502346947.1711135834; _fbp=fb.2.1711306313360.1356282095; cf_clearance=QFQw4RiWw63XkbCGKziP0TKdoNVa4rUQSozkjTJEhPw-1738448496-1.2.1.1-VLZVXLhza9A7_vkEmF2dMRBAmuiRlaSeEuIMHHAmDSTw2a44xZqvsGu159Dhw86UPEZLLFXXx5K98bmCrWVuLN9lI4pcFoO_1g4R5Oi.CBpBfE91VgBJ6QcrKlkxOxgm_ZERHOgxAajD1zPgcEcLDOifHVLHXFKwLZ_PRWZtY6XN7ov82IgHvfh1.ISpPPpAzYxA8S18XX3GRh.yWiBrLd2h.ORvWVUbhi0Jk_BIEmXM8ONkpqgfohurn8bIvRh7S1GDjKNt6PN7Won1B0cWCXtrCE0GV3a7okCPkp6_PVzrT86n.wJLNiB494zmSvbSNgSqFjnRoAzXCK_k9O9vTA; cf_chl_rc_m=20; _gid=GA1.3.5476645.1738447845; PHPSESSID=ifo49f05u7pktj43976kj3273r",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": 1,
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Priority": "u=0, i"
          };
          console.log(newUrl);
          response = await axios.post(url+newUrl, { headers: headers });
          console.log(response.status);
          const dom = new JSDOM(response.data);
          const document = dom.window.document;
          const table = document.querySelector(
            ".table.table-striped.border-bottom"
          );
          const rows = table.querySelectorAll("tr");
          const name = rows[0].querySelectorAll("td")[1].textContent;
          const programDescription =
            rows[1].querySelectorAll("td")[1].textContent;
          let res = `Name: ${name}\nProgram Description: ${programDescription}`;
          console.log(res);
          await client.sendSeen(message.from);
          await client.startTyping(message.from);
          await client.stopTyping(message.from);
          await client.sendText(message.from, res, { quotedMsg: message.id });
        } catch (e) {
          console.log(e);
          await client.sendSeen(message.from);
          await client.startTyping(message.from);
          await client.stopTyping(message.from);
          await client.sendText(message.from, `I Couldn't find the user`, {
            quotedMsg: message.id,
          });
        }
      } else {
        await client.sendSeen(message.from);
        await client.startTyping(message.from);
        await client.stopTyping(message.from);
        await client.sendText(
          message.from,
          `Please add a roll number after !find`,
          { quotedMsg: message.id }
        );
      }
    } else if (message.isGroupMsg) {
      let groupAdmins = await client.getGroupAdmins(message.from);
      for (let i = 0; i < groupAdmins.length; i++) {
        if (groupAdmins[i]._serialized === message.author) {
          isAdmin = true;
          break;
        }
      }
      if (message.body.startsWith("!ask") && message.body.length > 4) {
        let query = message.body.split("!ask ")[1];
        console.log(query);
        if (query) {
          try {
            await client.sendSeen(message.from);
            await client.startTyping(message.from);
            let res = await sendMessage(query);
            console.log(res);
            await client.stopTyping(message.from);
            await client.sendText(message.from, res, {
              quotedMsg: message.id,
            });
          } catch (e) {
            await client.sendSeen(message.from);
            await client.startTyping(message.from);
            await client.stopTyping(message.from);
            await client.sendText(
              message.from,
              `I Couldn't process the query`,
              { quotedMsg: message.id }
            );
          }
        } else {
          await client.sendSeen(message.from);
          await client.startTyping(message.from);
          await client.stopTyping(message.from);
          await client.sendText(message.from, `Please add a query after !ask`, {
            quotedMsg: message.id,
          });
        }
      } else if (message.body.startsWith("!status")) {
        const url = "https://api.iotkiit.in/items/status";
        const headers = {
          Host: "api.iotkiit.in",
        };
        try {
          const response = await axios.get(url, { headers: headers });
          const data = response.data;
          const status =
            data["data"]["current_status"] == "opened" ? "Open" : "Closed";
          await client.sendSeen(message.from);
          await client.startTyping(message.from);
          await client.stopTyping(message.from);
          await client.sendText(message.from, `Lab is *${status}*`, {
            quotedMsg: message.id,
          });
        } catch (e) {
          await client.sendSeen(message.from);
          await client.startTyping(message.from);
          await client.stopTyping(message.from);
          await client.sendText(message.from, `I Couldn't fetch Lab's Status`, {
            quotedMsg: message.id,
          });
        }
      } else if (message.body.startsWith("!help")) {
        try {
          await client.sendSeen(message.from);
          await client.startTyping(message.from);
          await client.stopTyping(message.from);
          await client.sendText(
            message.from,
            "*List of Commands:*\n\n\n*For Admins:*\n\n*Add User:* !add @91{Ph.Num}\n\n*Remove User:* !rm @mention or reply to user with !rm\n\n*Promote as Admin:* !promote @mention or reply to a user with !promote\n\n*Demote as Admin:* !demote @mention or reply to a user with !demote\n\n*Get Group Link:* !getlink\n\n\n*For Members:*\n\n*Lab Status*: !status\n\n*Ask our AI:* !ask {query}\n\n*Find someone by RollNum:* !find {rollnum}.\n\n\n*You can also chat in Bot's DM without any commands.*",
            {
              quotedMsg: message.id,
            }
          );
        } catch (e) {
          await client.sendSeen(message.from);
          await client.startTyping(message.from);
          await client.stopTyping(message.from);
          await client.sendText(message.from, `I Couldn't process the query`, {
            quotedMsg: message.id,
          });
        }
      } else if (isAdmin) {
        if (message.body.startsWith("!rm")) {
          if (message.body.length > 3) {
            let mentionedUser = message.body.split("@")[1];
            if (mentionedUser) {
              try {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.removeParticipant(
                  message.from,
                  `${mentionedUser}@c.us`
                );
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `User @${mentionedUser} was removed.`,
                  { quotedMsg: message.id }
                );
              } catch (e) {
                await client.sendText(
                  message.from,
                  `I Couldn't remove the @${mentionedUser}`,
                  { quotedMsg: message.id }
                );
              }
            } else {
              await client.sendSeen(message.from);
              await client.startTyping(message.from);
              await client.stopTyping(message.from);
              await client.sendText(
                message.from,
                `I Couldn't remove the @${mentionedUser}`,
                { quotedMsg: message.id }
              );
            }
          } else if (message.quotedMsgId) {
            let getUser = message.quotedMsgId.split("_")[3];
            if (getUser) {
              try {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.removeParticipant(message.from, getUser);
                await client.stopTyping(message.from);
                await client.sendText(message.from, `User was removed.`, {
                  quotedMsg: message.id,
                });
              } catch (e) {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `I Couldn't remove @${getUser.split("@")[0]}. Error: ${e}`,
                  { quotedMsg: message.id }
                );
              }
            } else {
              await client.sendSeen(message.from);
              await client.startTyping(message.from);
              await client.stopTyping(message.from);
              await client.sendText(
                message.from,
                `I Couldn't remove @${getUser.split("@")[0]}`,
                { quotedMsg: message.id }
              );
            }
          } else {
            await client.sendSeen(message.from);
            await client.startTyping(message.from);
            await client.stopTyping(message.from);
            await client.sendText(
              message.from,
              "Please Reply to someone to remove them, or just mention them as !remove @user",
              { quotedMsg: message.id }
            );
          }
        } else if (message.body.startsWith("!add")) {
          if (message.body.length > 4) {
            let mentionedUser = message.body.split("@")[1];
            if (mentionedUser) {
              try {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.addParticipant(
                  message.from,
                  `${mentionedUser}@c.us`
                );
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `User @${mentionedUser} Added to Group!`,
                  { quotedMsg: message.id }
                );
              } catch (e) {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `I Couldn't Add User @${mentionedUser}.`,
                  { quotedMsg: message.id }
                );
              }
            } else {
              await client.sendSeen(message.from);
              await client.startTyping(message.from);
              await client.stopTyping(message.from);
              await client.sendText(
                message.from,
                `I Couldn't Add User @${mentionedUser}.`,
                { quotedMsg: message.id }
              );
            }
          } else if (message.quotedMsgId) {
            let getUser = message.quotedMsgId.split("_")[3];
            if (getUser) {
              try {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.addParticipant(message.from, getUser);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `User ${getUser.split("@")[0]} was Added!`,
                  { quotedMsg: message.id }
                );
              } catch (e) {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `I Couldn't add @${getUser.split("@")[0]}. Error: ${e}`,
                  { quotedMsg: message.id }
                );
              }
            } else {
              await client.sendSeen(message.from);
              await client.startTyping(message.from);
              await client.stopTyping(message.from);
              await client.sendText(
                message.from,
                `I Couldn't add @${getUser.split("@")[0]}`,
                { quotedMsg: message.id }
              );
            }
          } else {
            await client.sendSeen(message.from);
            await client.startTyping(message.from);
            await client.stopTyping(message.from);
            await client.sendText(
              message.from,
              "Please reply to someone to add again, or just mention someone like !add @user",
              { quotedMsg: message.id }
            );
          }
        } else if (message.body.startsWith("!promote")) {
          if (message.body.length > 8) {
            let mentionedUser = message.body.split("@")[1];
            if (mentionedUser) {
              try {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.promoteParticipant(
                  message.from,
                  `${mentionedUser}@c.us`
                );
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `User @${mentionedUser} was Promoted as Admin!`,
                  { quotedMsg: message.id }
                );
              } catch (e) {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `I Couldn't Promote User @${mentionedUser}.`,
                  { quotedMsg: message.id }
                );
              }
            } else {
              await client.sendSeen(message.from);
              await client.startTyping(message.from);
              await client.stopTyping(message.from);
              await client.sendText(
                message.from,
                `I Couldn't Promote User @${mentionedUser}.`,
                { quotedMsg: message.id }
              );
            }
          } else if (message.quotedMsgId) {
            let getUser = message.quotedMsgId.split("_")[3];
            if (getUser) {
              try {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.promoteParticipant(message.from, getUser);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `User ${getUser.split("@")[0]} was Promoted as Admin!`,
                  { quotedMsg: message.id }
                );
              } catch (e) {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `I Couldn't Promote @${getUser.split("@")[0]}. Error: ${e}`,
                  { quotedMsg: message.id }
                );
              }
            } else {
              await client.sendSeen(message.from);
              await client.startTyping(message.from);
              await client.stopTyping(message.from);
              await client.sendText(
                message.from,
                `I Couldn't Promote @${getUser.split("@")[0]}`,
                { quotedMsg: message.id }
              );
            }
          } else {
            await client.sendSeen(message.from);
            await client.startTyping(message.from);
            await client.stopTyping(message.from);
            await client.sendText(
              message.from,
              "Please reply to someone to Promote as Admin, or just mention someone like !promote @user",
              { quotedMsg: message.id }
            );
          }
        } else if (message.body.startsWith("!demote")) {
          if (message.body.length > 7) {
            let mentionedUser = message.body.split("@")[1];
            if (mentionedUser) {
              try {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.demoteParticipant(
                  message.from,
                  `${mentionedUser}@c.us`
                );
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `User @${mentionedUser} was Demoted as Admin!`,
                  { quotedMsg: message.id }
                );
              } catch (e) {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `I Couldn't Demote User @${mentionedUser}.`,
                  { quotedMsg: message.id }
                );
              }
            } else {
              await client.sendSeen(message.from);
              await client.startTyping(message.from);
              await client.stopTyping(message.from);
              await client.sendText(
                message.from,
                `I Couldn't Demote User @${mentionedUser}.`,
                { quotedMsg: message.id }
              );
            }
          } else if (message.quotedMsgId) {
            let getUser = message.quotedMsgId.split("_")[3];
            if (getUser) {
              try {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.demoteParticipant(message.from, getUser);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `User ${getUser.split("@")[0]} was Demoted as Admin!`,
                  { quotedMsg: message.id }
                );
              } catch (e) {
                await client.sendSeen(message.from);
                await client.startTyping(message.from);
                await client.stopTyping(message.from);
                await client.sendText(
                  message.from,
                  `I Couldn't Demote @${getUser.split("@")[0]}. Error: ${e}`,
                  { quotedMsg: message.id }
                );
              }
            } else {
              await client.sendSeen(message.from);
              await client.startTyping(message.from);
              await client.stopTyping(message.from);
              await client.sendText(
                message.from,
                `I Couldn't Demote @${getUser.split("@")[0]}`,
                { quotedMsg: message.id }
              );
            }
          } else {
            await client.sendSeen(message.from);
            await client.startTyping(message.from);
            await client.stopTyping(message.from);
            await client.sendText(
              message.from,
              "Please reply to someone to Demote as Admin, or just mention someone like !demote @user",
              { quotedMsg: message.id }
            );
          }
        } else if (
          message.body.startsWith("!getlink") &&
          message.body.length > 8
        ) {
          try {
            await client.sendSeen(message.from);
            await client.startTyping(message.from);
            await client.stopTyping(message.from);
            let link = await client.getGroupInviteLink(message.from);
            await client.sendText(message.from, `Group Invite Link: ${link}`, {
              quotedMsg: message.id,
            });
          } catch (e) {
            await client.sendSeen(message.from);
            await client.startTyping(message.from);
            await client.stopTyping(message.from);
            await client.sendText(message.from, `I Couldn't get the link.`, {
              quotedMsg: message.id,
            });
          }
        }
        // console.log(message.from);
        // console.log(message.to);
        // console.log(message.chat);
        // console.log(message.author);

        // console.log(groupAdmins);
      } else if (
        message.body.startsWith("!rm") ||
        message.body.startsWith("!add") ||
        message.body.startsWith("!promote") ||
        message.body.startsWith("!getlink")
      ) {
        await client.sendSeen(message.from);
        await client.startTyping(message.from);
        await client.stopTyping(message.from);
        await client.sendText(
          message.from,
          "You are not an admin to perform this action",
          { quotedMsg: message.id }
        );
      }
    } else if (message.type === "chat") {
      await client.sendSeen(message.from);
      if (
        message.body.toLowerCase() === "hi" ||
        message.body.toLowerCase() === "hello"
      ) {
        console.log(message.from);
        await client.sendText(
          message.from,
          "Hey There!\nType down anything to get started!",
          {
            quotedMsg: message.id,
          }
        );
      } else {
        try {
          await client.sendSeen(message.from);
          await client.startTyping(message.from);
          let res = await sendMessage(message.body);
          console.log(res);
          await client.stopTyping(message.from);
          await client.sendText(message.from, res, {
            quotedMsg: message.id,
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  });
}

startWPP();
