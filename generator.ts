import {promises as fs} from 'fs';
import {addDays, format} from "date-fns";

type Task = {
    date: Date,
    description: string,
    priority: number,
}

function taskToRow(task: Task): string {
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
    start?: number,
    skips: Date[],
}

function scheduleToCSV(schedule: Schedule): string[] {
    const rows = [];
    const {description, startDate, duration, skips, start} = schedule;

    let date = startDate;
    let weekCounter = start || 1;
    const endWeek = weekCounter + duration - 1;

    while (weekCounter <= endWeek) {
        if (!skips.some(skip => format(skip, 'w') === format(date, 'w'))) {
            rows.push(taskToRow({date, description: `${description} Week ${weekCounter}`, priority: 4}));
            weekCounter++;
        }
        date = addDays(date, 7);
    }

    return rows;
}

async function main() {
    const csvRows = ["TYPE,CONTENT,DESCRIPTION,PRIORITY,INDENT,AUTHOR,RESPONSIBLE,DATE,DATE_LANG,TIMEZONE,DURATION,DURATION_UNIT"]

    // const lecRows2250 = scheduleToCSV({
    //     description: 'SENG2250 Lecture',
    //     startDate: new Date(2024, 6, 23),
    //     duration: 13,
    //     skips: [
    //         new Date(2024, 7, 26),
    //         new Date(2022, 8, 30),
    //     ],
    // })


    const lecRows4500 = scheduleToCSV({
        description: 'SENG4500 Lecture',
        startDate: new Date(2024, 6, 26),
        duration: 13,
        skips: [
            new Date(2024, 7, 26),
            new Date(2022, 8, 30),
        ],
    })

    const workshopRows4500 = scheduleToCSV({
        description: 'SENG4500 Workshop',
        startDate: new Date(2024, 6, 29),
        duration: 12,
        start: 2,
        skips: [
            new Date(2024, 7, 26),
            new Date(2022, 8, 30),
        ],
    })

    csvRows.push(...lecRows4500);
    csvRows.push(...workshopRows4500);

    try {
        await fs.writeFile("todos.csv", csvRows.join('\n'));
    } catch (error) {
        console.error('Error converting markdown todos to CSV:', error);
    }
}

main();
