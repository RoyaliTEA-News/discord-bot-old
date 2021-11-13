import { exec } from "child_process";
import dl from "download-git-repo";

export const load = async () => {
  setInterval(download, 60000 * 10);
  download();
};

function download() {
  exec("yarn removeRadios", () => {
    dl("direct:https://github.com/RoyaliTEA-News/radios", `${process.cwd()}/radios/`, { clone: true }, () => { return });
  })
}

export default load;