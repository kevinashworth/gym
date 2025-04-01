import slugify from "@sindresorhus/slugify";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

async function sharePicture(url: string, name: string) {
  const shortenedName = slugify(name.trim()).slice(0, 24);
  const filename = shortenedName ? `gotyou-referral-${shortenedName}` : "gotyou-share-referral";

  const downloadPath = `${FileSystem.cacheDirectory}${filename}.png`;

  const { uri } = await FileSystem.downloadAsync(url, downloadPath);

  if (!(await Sharing.isAvailableAsync())) {
    return Promise.reject(new Error("Sharing is not available"));
  }

  return await Sharing.shareAsync(uri);
}

export default sharePicture;
