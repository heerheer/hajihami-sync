import { getAllCollectionData } from "./utils";
import {readFileSync, writeFileSync} from "fs";

const data = readFileSync("./data.json", "utf-8")



console.log(data.length, "blocks fetched from Notion");
