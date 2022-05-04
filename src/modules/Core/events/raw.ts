import axios from "axios";
import FormData from "form-data";

import Captcha from "../../../util/CaptchaGenerator";

export = {
  name: "raw",
  async execute(_client: Bot, data) {
    if (data.t !== "INTERACTION_CREATE") return;

    const interaction = data.d,
      component = interaction.message?.components?.[0];

    if (!component) return;

    const split = interaction.data.custom_id.split("-");

    if (interaction.type == 5) {
      const modal = interaction.data.components[0].components[0],
        input = modal.value,
        correct = modal.custom_id.split("-")[1];

      if (correct.toLowerCase() === input.toLowerCase()) {
        console.log("valid")
      } else {
        console.log("invalid")
      }
    } else if (interaction.type == 3) {
      if (split[0] == "mainMsg") {
        const captcha = new Captcha(100),
          newData = new FormData();

        newData.append("files[0]", captcha.PNGStream, { filename: 'captcha.png', contentType: 'image/png' });
        newData.append("payload_json", JSON.stringify({
          "type": 4,
          "data": {
            "embeds": [
              {
                "title": "Verification Code",
                "description": "Please click the verify button and enter the code you see below.",
                "color": 16777215,
                "image": {
                  "url": "attachment://captcha.png"
                }
              }
            ],
            "components": [
              {
                "type": 1,
                "components": [
                  {
                    "custom_id": `captchaMsg-${captcha.value}`,
                    "disabled": false,
                    "label": 'Verify',
                    "style": 1,
                    "type": 2
                  }
                ]
              }
            ],
            "flags": 64
          }
        }))

        axios(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
          method: "POST",
          data: newData,
          headers: {
            ...newData.getHeaders(),
            "Content-Type": "multipart-formdata"
          }
        })
      } else if (split[0] == "captchaMsg")
        axios(`https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`, {
          method: "POST",
          data: {
            "type": 9,
            "data": {
              "title": "Verification",
              "custom_id": "verify",
              "components": [
                {
                  "type": 1,
                  "components": [
                    {
                      "type": 4,
                      "custom_id": `verifyKey-${split[1]}`,
                      "label": "Code",
                      "style": 1,
                      "min_length": 1,
                      "max_length": 10,
                      "required": true
                    }
                  ]
                }
              ]
            }
          },
          headers: { "Content-Type": "application/json" }
        })
    }
  }
}