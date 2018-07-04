import { DataFormatter } from './data-formatter';

describe('DataFormatter', () => {
  const winterDateTimes = [
    ['2018-12-30T12:00:00.00Z', '30.12.2018 14:00'],
    ['2018-12-29T22:00:00.00Z', '30.12.2018 00:00'],
    ['2018-12-29T21:00:00.00Z', '29.12.2018 23:00'],
    ['2018-12-30T00:00:00.00Z', '30.12.2018 02:00'],
    ['2018-12-31T22:00:00.00Z', '01.01.2019 00:00']
  ];
  const winterDates = winterDateTimes.map(([stamp, datetime]) => [
    stamp,
    datetime.slice(0, 10)
  ]);
  const summerDateTimes = [
    ['2018-06-30T12:00:00.00Z', '30.06.2018 15:00'],
    ['2018-06-29T22:00:00.00Z', '30.06.2018 01:00'],
    ['2018-06-29T21:00:00.00Z', '30.06.2018 00:00'],
    ['2018-06-30T00:00:00.00Z', '30.06.2018 03:00'],
    ['2018-06-01T23:00:00.00Z', '02.06.2018 02:00']
  ];
  const summerDates = summerDateTimes.map(([stamp, datetime]) => [
    stamp,
    datetime.slice(0, 10)
  ]);

  // The library used handles date related issues, so not every special case needs to be tested
  describe('formatDate', () => {
    it('should format simple winter date string to correct timezone date (UTC+2)', () => {
      winterDates.forEach(([timestamp, correctFormat]) => {
        expect(DataFormatter.formatDate(timestamp)).toBe(correctFormat);
      });
    });
    it('should format simple winter date objects to correct timezone date (UTC+2)', () => {
      winterDates.forEach(([timestamp, correctFormat]) => {
        expect(DataFormatter.formatDate(new Date(timestamp))).toBe(
          correctFormat
        );
      });
    });
    it('should format simple summer date string to correct timezone date (UTC+3)', () => {
      summerDates.forEach(([timestamp, correctFormat]) => {
        expect(DataFormatter.formatDate(timestamp)).toBe(correctFormat);
      });
    });
    it('should format simple summer date objects to correct timezone date (UTC+3)', () => {
      summerDates.forEach(([timestamp, correctFormat]) => {
        expect(DataFormatter.formatDate(new Date(timestamp))).toBe(
          correctFormat
        );
      });
    });
  });

  describe('formatDateTime', () => {
    it('should format simple winter date string to correct timezone datetime (UTC+2)', () => {
      winterDateTimes.forEach(([timestamp, correctFormat]) => {
        expect(DataFormatter.formatDateTime(timestamp)).toBe(correctFormat);
      });
    });
    it('should format simple winter date objects to correct timezone datetime (UTC+2)', () => {
      winterDateTimes.forEach(([timestamp, correctFormat]) => {
        expect(DataFormatter.formatDateTime(new Date(timestamp))).toBe(
          correctFormat
        );
      });
    });
    it('should format simple summer date string to correct timezone datetime (UTC+3)', () => {
      summerDateTimes.forEach(([timestamp, correctFormat]) => {
        expect(DataFormatter.formatDateTime(timestamp)).toBe(correctFormat);
      });
    });
    it('should format simple summer date objects to correct timezone datetime (UTC+3)', () => {
      summerDateTimes.forEach(([timestamp, correctFormat]) => {
        expect(DataFormatter.formatDateTime(new Date(timestamp))).toBe(
          correctFormat
        );
      });
    });
  });

  describe('escapeHtml', () => {
    // Uses library, so only very basic functionality is tested
    it('should escape HTML', () => {
      expect(
        DataFormatter.escapeHtml(
          '<script>console.log("hax");</script><p><a href="/test">Link</a>'
        )
      ).toBe(
        // tslint:disable-next-line:max-line-length
        '&lt;script&gt;console.log(&quot;hax&quot;);&lt;/script&gt;&lt;p&gt;&lt;a href=&quot;/test&quot;&gt;Link&lt;/a&gt;'
      );
    });
  });

  describe('tagsToHtml', () => {
    function testTagsToHtml(input, output) {
      expect(DataFormatter.tagsToHtml(input)).toBe(output);
    }

    it('should convert individual [b], [u] and [i] tags', () => {
      testTagsToHtml('[b]Test[/b]', '<b>Test</b>');
      testTagsToHtml('[u]Test[/u]', '<u>Test</u>');
      testTagsToHtml('[i]Test[/i]', '<i>Test</i>');
    });
    it('should convert individual [url] and [color] tags', () => {
      testTagsToHtml(
        '[url=https://voyacode.com]Test[/url]',
        '<a href="https://voyacode.com">Test</a>'
      );
      testTagsToHtml(
        '[color=black]Test[/color]',
        '<span style="color:black">Test</span>'
      );
    });
    it('should convert nested tags', () => {
      testTagsToHtml(
        '[b][i][u][url=/test][color=#112233]Test[/color][/url][/u][/i][/b]',
        '<b><i><u><a href="/test"><span style="color:#112233">Test</span></a></u></i></b>'
      );
    });
    it('should convert more than 1 of same tag', () => {
      testTagsToHtml('[b]Test1[/b][b]Test2[/b]', '<b>Test1</b><b>Test2</b>');
      testTagsToHtml(
        '[url=/test]Test[/url][url=/test2]Test2[/url]',
        '<a href="/test">Test</a><a href="/test2">Test2</a>'
      );
    });
    it('should replace line breaks', () => {
      testTagsToHtml('Line1\nLine2', 'Line1<br>Line2');
    });
    it('should not convert [color] tags that include " or ; characters in color', () => {
      testTagsToHtml(
        '[color=black;]Color[/color][color=black"]Color[/color]',
        '[color=black;]Color[/color][color=black"]Color[/color]'
      );
    });
    it('should not convert [url] tags that include " characters in url', () => {
      testTagsToHtml('[url="]url[/url]', '[url="]url[/url]');
    });
  });
});
