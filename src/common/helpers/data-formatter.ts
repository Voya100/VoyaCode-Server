import escapeHtml from 'escape-html';
import moment from 'moment-timezone';

export class DataFormatter {
  static formatDate(date: string | Date) {
    return moment(date)
      .tz('Europe/Helsinki')
      .format('DD.MM.YYYY');
  }

  static formatDateTime(date: string | Date) {
    return moment(date)
      .tz('Europe/Helsinki')
      .format('DD.MM.YYYY HH:mm');
  }

  static escapeHtml(str: string) {
    return escapeHtml(str);
  }

  static tagsToHtml(text: string) {
    const tagsToReplace = ['b', 'u', 'i'];
    text = text.replace(/\n/g, '<br>');
    text = tagsToReplace.reduce((txt, tag) => replaceTag(tag, txt), text);

    let tag = /\[url=(.*?)\](.*?)\[\/url\]/gi;
    let tagRep = '<a href="$1">$2</a>';
    text = text.replace(tag, tagRep);

    tag = /\[color=(.*?)\](.*?)\[\/color\]/gi;
    tagRep = '<span style="color:$1">$2</span>';
    text = text.replace(tag, tagRep);

    return text;
  }
}

// Replaces tags that use format [tagname]{conent}[/tagname] with similar HTML tags
// (<tagname>{content}</tagname>)
function replaceTag(tagName: string, text: string) {
  const regex = RegExp('\\[' + tagName + '\\](.*?)\\[/' + tagName + '\\]', 'g');
  const tagRep = '<' + tagName + '>$1</' + tagName + '>';
  return text.replace(regex, tagRep);
}
