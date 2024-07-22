import {promises as fs} from 'fs';
import {importObsidianFile} from "./obsidian-interface";
import {addDays, format} from "date-fns";

type Task = {
    date: Date,
    description: string,
    priority: number,
}

const taskToRow = (task: Task): string => {
    const {date, description, priority} = task;

    const row = [
        'task',
        description,
        '',
        priority.toString(),
        "1",
        "stracharater (10283909)",
        '',
        format(date, 'MMM d yyyy'),
        "en",
        "Australia/Sydney",
        '',
        '',
    ];

    return row.join(',');
}

type Schedule = {
    description: string,
    startDate: Date,
    duration: number,
    skips: Date[],
}

function scheduleToCSV(schedule: Schedule): string[] {
    const rows = [];
    const {startDate, duration, skips} = schedule;

    let i = 1;
    let date = startDate;

    while (i <= duration) {
        // if the date is in the same week as a skip, skip it
        if (!skips.some(skip => format(skip, 'w') === format(date, 'w'))) {
            rows.push(taskToRow({date, description: `${schedule.description} Week ${i}`, priority: 4}));
            i++;
        }

        date = addDays(date, 7);
    }

    return rows;
}

async function main() {
    const lectureRows = scheduleToCSV({
        description: 'SENG2250 Lecture',
        startDate: new Date(2024, 6, 24),
        duration: 13,
        skips: [
            new Date(2024, 7, 26),
            new Date(2022, 8, 30),
        ],
    })

    try {
        await fs.writeFile("todos.csv", lectureRows.join('\n'));
    } catch (error) {
        console.error('Error converting markdown todos to CSV:', error);
    }
}

main();
