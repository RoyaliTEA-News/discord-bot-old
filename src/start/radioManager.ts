import dl from "./downloadRepo";

export const load = async () => {
  setInterval(download, 60000 * 10);
  download();
};

function download() {
  dl("direct:https://github.com/RoyaliTEA-News/radios", `${process.cwd()}/radios/`, { clone: true }, () => { return });
}

export default load;