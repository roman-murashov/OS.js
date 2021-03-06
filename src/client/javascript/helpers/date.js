/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2017, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

/*eslint valid-jsdoc: "off"*/

/////////////////////////////////////////////////////////////////////////////
// HELPERS
/////////////////////////////////////////////////////////////////////////////

function filter(from, index, shrt, toindex) {
  const list = [];
  for ( let i = (shrt ? 0 : toindex); i < from.length; i++ ) {
    list.push(from[i]);
  }
  return list;
}

function format(fmt, date) {
  /*eslint no-use-before-define: "off"*/
  let utc;

  if ( typeof fmt === 'undefined' || !fmt ) {
    fmt = ExtendedDate.config.defaultFormat;
  } else {
    if ( typeof fmt !== 'string' ) {
      utc = fmt.utc;
      fmt = fmt.format;
    } else {
      utc = ExtendedDate.config.utc;
    }
  }

  return formatDate(date, fmt, utc);
}

function _now(now) {
  /*eslint no-use-before-define: "off"*/
  return now ? (now instanceof ExtendedDate ? now.date : now) : new Date();
}

function _y(y, now) {
  return (typeof y === 'undefined' || y === null || y < 0 ) ? now.getFullYear() : y;
}

function _m(m, now) {
  return (typeof m === 'undefined' || m === null || m < 0 ) ? now.getMonth() : m;
}

/////////////////////////////////////////////////////////////////////////////
// EXTENDED DATE
/////////////////////////////////////////////////////////////////////////////

/**
 * Extended Date Helper
 *
 * Works just like 'Date', but has some extended methods
 *
 * @desc Class for date manipulation and formatting.
 */
export default class ExtendedDate {

  /**
   * @param {(Date|ExtendedDate)} [date] Create new instance from this date
   */
  constructor(date) {
    if ( date ) {
      if ( date instanceof Date ) {
        this.date = date;
      } else if ( date instanceof ExtendedDate ) {
        this.date = date.date;
      } else if ( typeof date === 'string' ) {
        this.date = new Date(date);
      }
    }

    if ( !this.date ) {
      this.date = new Date();
    }
  }

  //
  // Global Configuration
  //
  static get config() {
    return {
      defaultFormat: 'isoDateTime'
      //utc: true
    };
  }

  static get dayNames() {
    return [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
  }

  static get monthNames() {
    return [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }

  //
  // Extended Methods
  //

  /**
   * Get the 'Date' Object
   *
   * @return  {DateExtended}
   */
  get() {
    return this.date;
  }

  /**
   * Format date
   *
   * @param   {String}      fmt     Format (ex: "Y/m/d")
   *
   * @return  {String}              Formatted date
   *
   * <pre><code>
   * Format is (same as PHP docs):
   *
   *   d: Day of the month, 2 digits with leading zeros (01 to 31)
   *   D: A textual representation of a day, three letters (Mon through Sun)
   *   j: Day of the month without leading zeros (1 to 31)
   *   l: A full textual representation of the day of the week (Sunday through Saturday)
   *   w: Numeric representation of the day of the week (0 (for Sunday) through 6 (for Saturday))
   *   z: The day of the year (starting from 0) (0 through 365)
   *   S: English ordinal suffix for the day of the month, 2 characters (st, nd, rd or th. Works well with j)
   *   W: ISO-8601 week number of year, weeks starting on Monday (Example: 42 (the 42nd week in the year))
   *   F: A full textual representation of a month, such as January or March (January through December)
   *   m: Numeric representation of a month, with leading zeros (01 through 12)
   *   M: A short textual representation of a month, three letters (Jan through Dec)
   *   n: Numeric representation of a month, without leading zeros (1 through 12)
   *   t: Number of days in the given month (28 through 31)
   *   Y: A full numeric representation of a year, 4 digits (Examples: 1999 or 2003)
   *   y: A two digit representation of a year (Examples: 99 or 03)
   *   a: Lowercase Ante meridiem and Post meridiem (am or pm)
   *   A: Uppercase Ante meridiem and Post meridiem (AM or PM)
   *   g: 12-hour format of an hour without leading zeros (1 through 12)
   *   G: 24-hour format of an hour without leading zeros (0 through 23)
   *   h: 12-hour format of an hour with leading zeros (01 through 12)
   *   H: 24-hour format of an hour with leading zeros (00 through 23)
   *   i: Minutes with leading zeros (00 to 59)
   *   s: Seconds, with leading zeros (00 through 59)
   *   O: Difference to Greenwich time (GMT) in hours (Example: +0200)
   *   T: Timezone abbreviation (Examples: EST, MDT ...)
   *   U: Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
   * </code></pre>
   */

  format(fmt) {
    return ExtendedDate.format(this, fmt);
  }

  /**
   * Get First day in month
   *
   * @see DateExtended#format
   *
   * @param   {String}    [fmt]     Date format
   *
   * @return  {String|ExtendedDate}     If no format is given it will return ExtendedDate
   */
  getFirstDayInMonth(fmt) {
    return ExtendedDate.getFirstDayInMonth(fmt, null, null, this);
  }

  /**
   * Get Last day in month
   *
   * @see DateExtended#format
   *
   * @param   {String}    [fmt]     Date format
   *
   * @return  {String|ExtendedDate}     If no format is given it will return ExtendedDate
   */
  getLastDayInMonth(fmt) {
    return ExtendedDate.getLastDayInMonth(fmt, null, null, this);
  }

  /**
   * Get numbers of day in month
   *
   * @return  {Number}     Number of days
   */
  getDaysInMonth() {
    return ExtendedDate.getDaysInMonth(null, null, this);
  }

  /**
   * Get week number
   *
   * @return  {Number}     Week
   */
  getWeekNumber() {
    return ExtendedDate.getWeekNumber(this);
  }

  /**
   * Check if given range is within Month
   *
   * @param   {(Date|DateExtended)}    from      From date (can be Date)
   * @param   {(Date|DateExtended)}    to        To date (can be Date)
   *
   * @return  {Boolean}
   */
  isWithinMonth(from, to) {
    return ExtendedDate.isWithinMonth(this, from, to);
  }

  /**
   * Check if given range is within Year
   *
   * @return  {Boolean}
   */
  getDayOfTheYear() {
    return ExtendedDate.getDayOfTheYear();
  }

  //
  // Static Methods
  //

  /**
   * @see DateExtended#format
   */
  static format(date, fmt) {
    return format(fmt, date);
  }

  /**
   * @see DateExtended#getPreviousMonth
   */
  static getPreviousMonth(now) {
    now = now ? (now instanceof ExtendedDate ? now.date : now) : new Date();
    let current;

    if (now.getMonth() === 0) {
      current = new Date(now.getFullYear() - 1, 11, now.getDate());
    } else {
      current = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }

    return new ExtendedDate(current);
  }

  /**
   * @see DateExtended#getNextMonth
   */
  static getNextMonth(now) {
    now = now ? (now instanceof ExtendedDate ? now.date : now) : new Date();
    let current;

    if (now.getMonth() === 11) {
      current = new Date(now.getFullYear() + 1, 0, now.getDate());
    } else {
      current = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    return new ExtendedDate(current);
  }

  /**
   * @see DateExtended#getFirstDayInMonth
   */
  static getFirstDayInMonth(fmt, y, m, now) {
    now = _now(now);
    y = _y(y, now);
    m = _m(m, now);

    const date = new Date();
    date.setFullYear(y, m, 1);
    if ( fmt === true ) {
      return date.getDate();
    }
    return fmt ? format(fmt, date) : new ExtendedDate(date);
  }

  /**
   * @see DateExtended#getLastDayInMonth
   */
  static getLastDayInMonth(fmt, y, m, now) {
    now = _now(now);
    y = _y(y, now);
    m = _m(m, now);

    const date = new Date();
    date.setFullYear(y, m, 0);
    if ( fmt === true ) {
      return date.getDate();
    }
    return fmt ? format(fmt, date) : new ExtendedDate(date);
  }

  /**
   * @see DateExtended#getDaysInMonth
   */
  static getDaysInMonth(y, m, now) {
    now = _now(now);
    y = _y(y, now);
    m = _m(m, now);

    const date = new Date();
    date.setFullYear(y, m, 0);
    return parseInt(date.getDate(), 10);
  }

  /**
   * @see DateExtended#getWeekNumber
   */
  static getWeekNumber(now) {
    now = now ? (now instanceof ExtendedDate ? now.date : now) : new Date();

    const d = new Date(+now);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
  }

  /**
   * @see DateExtended#getDayName
   */
  static getDayName(index, shrt) {
    if ( index < 0 || index === null || typeof index === 'undefined' ) {
      return filter(ExtendedDate.dayNames, index, shrt, 7);
    }

    shrt = shrt ? 0 : 1;
    const idx = index + (shrt + 7);
    return ExtendedDate.dayNames[idx];
  }

  /**
   * @see DateExtended#getMonthName
   */
  static getMonthName(index, shrt) {
    if ( index < 0 || index === null || typeof index === 'undefined' ) {
      return filter(ExtendedDate.monthNames, index, shrt, 12);
    }

    shrt = shrt ? 0 : 1;
    const idx = index + (shrt + 12);
    return ExtendedDate.monthNames[idx];
  }

  /**
   * @see DateExtended#isWithinMonth
   */
  static isWithinMonth(now, from, to) {
    if ( now.getFullYear() >= from.getFullYear() && now.getMonth() >= from.getMonth() ) {
      if ( now.getFullYear() <= to.getFullYear() && now.getMonth() <= to.getMonth() ) {
        return true;
      }
    }
    return false;
  }

  /**
   * @see DateExtended#getDayOfTheYear
   */
  static getDayOfTheYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }
}

//
// Date Methods
//

const methods = [
  'UTC',
  'toString',
  'now',
  'parse',
  'getDate',
  'getDay',
  'getFullYear',
  'getHours',
  'getMilliseconds',
  'getMinutes',
  'getMonth',
  'getSeconds',
  'getTime',
  'getTimezoneOffset',
  'getUTCDate',
  'getUTCDay',
  'getUTCFullYear',
  'getUTCHours',
  'getUTCMilliseconds',
  'getUTCMinutes',
  'getUTCMonth',
  'getUTCSeconds',
  'getYear',
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
  'setTime',
  'setUTCDate',
  'setUTCFullYear',
  'setUTCHours',
  'setUTCMilliseconds',
  'setUTCMinutes',
  'setUTCMonth',
  'setUTCSeconds',
  'setYear',
  'toDateString',
  'toGMTString',
  'toISOString',
  'toJSON',
  'toLocaleDateString',
  'toLocaleFormat',
  'toLocaleString',
  'toLocaleTimeString',
  'toSource',
  'toString',
  'toTimeString',
  'toUTCString',
  'valueOf'
];

methods.forEach(function(m) {
  ExtendedDate.prototype[m] = function() {
    return this.date[m].apply(this.date, arguments);
  };
});

/////////////////////////////////////////////////////////////////////////////
// DATE FORMATTING
/////////////////////////////////////////////////////////////////////////////

/**
 * Inspired by: "Date Format" by Steven Levithan
 */
function formatDate(date, format, utc) {
  utc = utc === true;

  function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  const defaultFormats = {
    'default': 'Y-m-d H:i:s',
    shortDate: 'm/d/y',
    mediumDate: 'M d, Y',
    longDate: 'F d, Y',
    fullDate: 'l, F d, Y',
    shortTime: 'h:i A',
    mediumTime: 'h:i:s A',
    longTime: 'h:i:s A T',
    isoDate: 'Y-m-d',
    isoTime: 'H:i:s',
    isoDateTime: 'Y-m-d H:i:s'
  };

  format = defaultFormats[format] || format;

  if ( !(date instanceof ExtendedDate) ) {
    date = new ExtendedDate(date);
  }

  const map = {
    /*eslint new-cap: "warn"*/

    //
    // DAY
    //

    // Day of the month, 2 digits with leading zeros (01 to 31)
    d: function(s) {
      return pad(map.j(s));
    },

    // A textual representation of a day, three letters (Mon through Sun)
    D: function(s) {
      return ExtendedDate.dayNames[utc ? date.getUTCDay() : date.getDay()];
    },

    // Day of the month without leading zeros (1 to 31)
    j: function(s) {
      return (utc ? date.getUTCDate() : date.getDate());
    },

    // A full textual representation of the day of the week (Sunday through Saturday)
    l: function(s) {
      return ExtendedDate.dayNames[(utc ? date.getUTCDay() : date.getDay()) + 7];
    },

    // Numeric representation of the day of the week (0 (for Sunday) through 6 (for Saturday))
    w: function(s) {
      return (utc ? date.getUTCDay() : date.getDay());
    },

    // The day of the year (starting from 0) (0 through 365)
    z: function(s) {
      return date.getDayOfTheYear();
    },

    // S English ordinal suffix for the day of the month, 2 characters (st, nd, rd or th. Works well with j)
    S: function(s) {
      const d = utc ? date.getUTCDate() : date.getDate();
      return ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10];
    },

    //
    // WEEK
    //

    // ISO-8601 week number of year, weeks starting on Monday (Example: 42 (the 42nd week in the year))
    W: function(s) {
      return date.getWeekNumber();
    },

    //
    // MONTH
    //

    // A full textual representation of a month, such as January or March (January through December)
    F: function(s) {
      return ExtendedDate.monthNames[(utc ? date.getUTCMonth() : date.getMonth()) + 12];
    },

    // Numeric representation of a month, with leading zeros (01 through 12)
    m: function(s) {
      return pad(map.n(s));
    },

    // A short textual representation of a month, three letters (Jan through Dec)
    M: function(s) {
      return ExtendedDate.monthNames[(utc ? date.getUTCMonth() : date.getMonth())];
    },

    // Numeric representation of a month, without leading zeros (1 through 12)
    n: function(s) {
      return (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    },

    // Number of days in the given month (28 through 31)
    t: function(s) {
      return date.getDaysInMonth();
    },

    //
    // YEAR
    //

    // A full numeric representation of a year, 4 digits (Examples: 1999 or 2003)
    Y: function(s) {
      return (utc ? date.getUTCFullYear() : date.getFullYear());
    },

    // A two digit representation of a year (Examples: 99 or 03)
    y: function(s) {
      /*eslint new-cap: "off"*/
      return String(map.Y(s)).slice(2);
    },

    //
    // TIME
    //

    // Lowercase Ante meridiem and Post meridiem (am or pm)
    a: function(s) {
      /*eslint new-cap: "off"*/
      return map.G(s) < 12 ? 'am' : 'pm';
    },

    // Uppercase Ante meridiem and Post meridiem (AM or PM)
    A: function(s) {
      return map.a(s).toUpperCase();
    },

    // 12-hour format of an hour without leading zeros (1 through 12)
    g: function(s) {
      /*eslint new-cap: "off"*/
      return map.G(s) % 12 || 12;
    },

    // 24-hour format of an hour without leading zeros (0 through 23)
    G: function(s) {
      return (utc ? date.getUTCHours() : date.getHours());
    },

    // 12-hour format of an hour with leading zeros (01 through 12)
    h: function(s) {
      return pad(map.g(s));
    },

    // 24-hour format of an hour with leading zeros (00 through 23)
    H: function(s) {
      /*eslint new-cap: "off"*/
      return pad(map.G(s));
    },

    // Minutes with leading zeros (00 to 59)
    i: function(s) {
      return pad(utc ? date.getUTCMinutes() : date.getMinutes());
    },

    // Seconds, with leading zeros (00 through 59)
    s: function(s) {
      return pad(utc ? date.getUTCSeconds() : date.getSeconds());
    },

    //
    // ZONE
    //

    // Difference to Greenwich time (GMT) in hours (Example: +0200)
    O: function(s) {
      const tzo = -date.getTimezoneOffset();
      const dif = tzo >= 0 ? '+' : '-';

      function ppad(num) {
        const norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      }

      const str = dif + ppad(tzo / 60) + ':' + ppad(tzo % 60);
      return str;
    },

    // Timezone abbreviation (Examples: EST, MDT ...)
    T: function(s) {
      if ( utc ) {
        return 'UTC';
      }

      const timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
      const zones = String(date.date).match(timezone) || [''];
      return zones.pop().replace(/(\+|\-)[0-9]+$/, '');
    },

    //
    // MISC
    //

    // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
    U: function(s) {
      return date.getTime();
    }
  };

  const result = [];
  format.split('').forEach(function(s) {
    result.push(map[s] ? map[s]() : s);
  });
  return result.join('');
}

