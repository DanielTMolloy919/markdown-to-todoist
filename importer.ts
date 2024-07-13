import {promises as fs} from 'fs';
import {importObsidianFile} from "./obsidian-interface";

const parseMarkdownToCSV = (markdown: string): string => {
    const tasks = importObsidianFile(markdown, 'path').filter(task => !task.isDone);


    return "";
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
