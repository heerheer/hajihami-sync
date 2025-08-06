import { getAllCollectionData } from "./utils";
import {writeFileSync} from "fs";

const data = await getAllCollectionData();
writeFileSync("./data.json", JSON.stringify(data, null, 2));


console.log(data.length, "blocks fetched from Notion");
