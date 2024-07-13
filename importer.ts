import { promises as fs } from 'fs';

const parseMarkdownToCSV = (markdown: string): string => {
    const lines = markdown.split('\n');
    const csvLines = lines.filter(line => line.startsWith('- [x]')).map(task => {
        // Assuming the format is consistent, extract the necessary parts
        const parts = task.match(/\[(x| )\] #task #small (.+) 🔁 every (.+) when done ➕ (.*) 🛫 (.*) ✅ (.*)/);
        if (!parts) return '';
        // Format: Status, Task, Frequency, Start Date, Planned Date, Completion Date
        return `Completed,${parts[2]},${parts[3]},${parts[4] || ''},${parts[5]},${parts[6]}`;
    });
    return csvLines.join('\n');
};

const convertMarkdownTodosToCSV = async (markdownFilePath: string, csvFilePath: string): Promise<void> => {
    try {
        const markdownContent = await fs.readFile(markdownFilePath, 'utf8');
        const csvContent = parseMarkdownToCSV(markdownContent);
        await fs.writeFile(csvFilePath, csvContent);
        console.log(`Converted ${markdownFilePath} to ${csvFilePath}`);``
    } catch (error) {
        console.error('Error converting markdown todos to CSV:', error);
    }
};

// Example usage
convertMarkdownTodosToCSV('todos.md', 'todos.csv');
