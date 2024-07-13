import {Task} from "./obsidian/Task";
import { TaskLocation } from "./obsidian/TaskLocation";
import moment from "moment";

export function importObsidianFile(fileContent: string, path: string): Task[] {
    const listItems: { line: string; index: number }[] = fileContent
        .split("\n")
        .map((line, index) => ({ line, index }))
        .filter((lineObj) => lineObj.line.match(/- \[([^\]])\]/));

    const obsidianListItems = listItems;
    //     .filter((lineObj) =>
    //   lineObj.line.includes("#task"),
    // );

    if (obsidianListItems.length === 0) return [];

    return getTasksFromFileContent(fileContent, listItems, path)
}

function getTasksFromFileContent(
    fileContent: string,
    listItems: { line: string; index: number }[],
    path: string,
    // fileCache: CachedMetadata,
    // file: TFile,
): Task[] {
    const tasks: Task[] = [];
    const fileLines = fileContent.split("\n");
    const linesInFile = fileLines.length;

    // Lazily store date extracted from filename to avoid parsing more than needed
    // this.logger.debug(`getTasksFromFileContent() reading ${file.path}`);
    // const dateFromFileName = new Lazy(() => DateFallback.fromPath(file.path));

    // We want to store section information with every task so
    // that we can use that when we post process the markdown
    // rendered lists.
    // let currentSection: SectionCache | null = null;
    // let sectionIndex = 0;
    for (const listItem of listItems) {
        // if (listItem.task !== undefined) {
        const lineNumber = listItem.index;
        if (lineNumber >= linesInFile) {
            /*
                  Obsidian CachedMetadata has told us that there is a task on lineNumber, but there are
                  not that many lines in the file.

                  This was the underlying cause of all the 'Stuck on "Loading Tasks..."' messages,
                  as it resulted in the line 'undefined' being parsed.

                  Somehow the file had been shortened whilst Obsidian was closed, meaning that
                  when Obsidian started up, it got the new file content, but still had the old cached
                  data about locations of list items in the file.
               */
            // this.logger.debug(
            //     `${file.path} Obsidian gave us a line number ${lineNumber} past the end of the file. ${linesInFile}.`,
            // );
            return tasks;
        }
        // if (currentSection === null || currentSection.position.end.line < lineNumber) {
        //   // We went past the current section (or this is the first task).
        //   // Find the section that is relevant for this task and the following of the same section.
        //   currentSection = Cache.getSection(lineNumber, fileCache.sections);
        //   sectionIndex = 0;
        // }
        //
        // if (currentSection === null) {
        //   // Cannot process a task without a section.
        //   continue;
        // }

        const line = fileLines[lineNumber];
        if (line === undefined) {
            // this.logger.debug(
            //   `${file.path}: line ${lineNumber} - ignoring 'undefined' line.`,
            // );
            continue;
        }

        let task;
        try {
            task = Task.fromLine({
                line,
                taskLocation: new TaskLocation(path, lineNumber, 0, 0, null),
                fallbackDate: moment(),
            });
        } catch (e) {
            console.error(e);
            continue;
        }

        if (task !== null) {
            // sectionIndex++;
            tasks.push(task);
        }
        // }
    }

    return tasks;
}
