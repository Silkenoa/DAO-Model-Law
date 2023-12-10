const fs = require('fs');
const _ = require('lodash');
const path = require('path');

/* this script need to read the source file and convert it in many smaller markdown */

const sourceMarkdown = fs.readFileSync(path.join('original', 'original_converted.md'), 'utf8');

/* the markdown file has some separators, the most important is '### Article {{number}}' */

const articles = sourceMarkdown.split('### Article ');

console.log(articles.length);

/* for each article we need to split between article and commentary */
_.each(articles, (article, index) => {

    if(index === 0) return;

    const firstLine = article.split('\n')[0];
    const content = _.tail(article.split('\n'));
    const articleNumber = firstLine.split('.')[0];
    const articleTitle = firstLine.split('.')[1];
    writeArticles(articleNumber, articleTitle, content);
    console.log(`done ${articleNumber} ${articleTitle} ${content.length}`)

});

function writeArticles(articleNumber, articleTitle, content) {

    /* for each 'content' we need to divide when the line is "*Commentary*" */
    const divider = '*Commentary*';

    /* we need to find the index of the divider */
    const dividerIndex = _.findIndex(content, (line) => {
        return line === divider;
    });

    /* now the lines before the diveder need to be saved in the folder 
     * 'markdown-pieces' with the name 'Article-{{number}}.md' and the 
     * lines after the divider need to be saved in the same folder
     * with the name 'Commentary-{{number}}.md' */

    const articleLines = _.take(content, dividerIndex);
    const commentaryContent = _.tail(_.drop(content, dividerIndex));

    const articleContent = `# ${articleNumber}. ${articleTitle}\n\n ${articleLines.join('\n')}`;
    fs.writeFileSync(path.join('markdown-pieces', `Article-${articleNumber}.md`), articleContent)
    fs.writeFileSync(path.join('markdown-pieces', `Commentary-${articleNumber}.md`), commentaryContent.join('\n'))
}
