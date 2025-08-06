import { getAllCollectionData } from "./utils";
import {writeFileSync} from "fs";

const data = await getAllCollectionData(100);
writeFileSync("./data.json", JSON.stringify(data, null, 2));


console.log(data.length, "blocks fetched from Notion");
