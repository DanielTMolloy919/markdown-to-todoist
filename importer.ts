import {promises as fs} from 'fs';
import {importObsidianFile} from "./obsidian-interface";
import {Priority} from "./obsidian/Priority";

const parseMarkdownToCSV = (markdown: string): string => {
    const tasks = importObsidianFile(markdown, 'path').filter(task => !task.isDone);

    const csvRows = ["TYPE,CONTENT,DESCRIPTION,PRIORITY,INDENT,AUTHOR,RESPONSIBLE,DATE,DATE_LANG,TIMEZONE,DURATION,DURATION_UNIT"]


    for (const task of tasks) {
        const priority = Number.parseInt(task.priority) + 1;

        const date = task.startDate ? task.startDate.format('MMM D YYYY') : '';

        let recurring = task.recurrence ? task.recurrence.rrule.toText().replace('week on ','') : '';

        if (task.recurrence?.baseOnToday) {
            recurring = recurring.replace("every", "every!");
        }


        const row = [
            'task',
            task.descriptionWithoutTags.replace(/,/g, ''),
            '',
            priority > 5 ? priority.toString() : "4",
            "1",
            "stracharater (10283909)",
            '',
            recurring || date,
            "en",
            "Australia/Sydney",
            '',
            '',
        ];
        csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
};

const convertMarkdownTodosToCSV = async (markdownFilePath: string, csvFilePath: string): Promise<void> => {
    try {
        const markdownContent = await fs.readFile(markdownFilePath, 'utf8');
        const csvContent = parseMarkdownToCSV(markdownContent);
        await fs.writeFile(csvFilePath, csvContent);
        console.log(`Converted ${markdownFilePath} to ${csvFilePath}`);
        ``
    } catch (error) {
        console.error('Error converting markdown todos to CSV:', error);
    }
};

// Example usage
convertMarkdownTodosToCSV('todos.md', 'todos.csv');
