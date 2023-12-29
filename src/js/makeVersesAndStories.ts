import fs from 'node:fs';
import readline from 'readline';

const bookNumber = process.argv[2];

if (!bookNumber) {
  console.error('please provide a book number of bible');
}

fs.writeFileSync(`output/verses/${bookNumber}.csv`, '');
fs.writeFileSync(`output/stories/${bookNumber}.csv`, '');

const fileStream = fs.createReadStream(`src/books/${bookNumber}.csv`);

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let chapter = '';
let verse = '';

for await (let line of rl) {
  line
    .replace(
      /^(\d+),(\d+)?,(\d+)?,$/,
      (_, book_number, chapter_number, verse_number) => {
        if (bookNumber !== book_number) {
          console.error('book numbers does not match');
        }

        chapter = chapter_number;
        verse = verse_number;
        return '';
      }
    )
    .replace(/^- (.+)$/, (_, story) => {
      fs.appendFileSync(
        `output/stories/${bookNumber}.csv`,
        `'${bookNumber}','${chapter}','${parseInt(verse) + 1}','${story}'` +
          '\n'
      );

      return '';
    })
    .replace(/^(\d+) (.+)$/, (_, verse_number, text) => {
      verse = `${parseInt(verse) + 1}`;

      if (verse_number !== verse) {
        console.error(
          'chapter: ',
          chapter,
          'mismatch of verse: ',
          verse_number
        );
      }

      fs.appendFileSync(
        `output/verses/${bookNumber}.csv`,
        `'${bookNumber}','${chapter}','${verse}','${text}'` + '\n'
      );

      return '';
    });
}
