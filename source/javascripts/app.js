(
  function frankShowalter(document) {
    function timeAgo(isoTime) {
      var date = new Date(isoTime);
      var time = date.getTime();

      var timeFormats = [
          [60, 'seconds', 1], // 60
          [120, '1 minute ago', '1 minute from now'], // 60*2
          [3600, 'minutes', 60], // 60*60, 60
          [7200, '1 hour ago', '1 hour from now'], // 60*60*2
          [86400, 'hours', 3600], // 60*60*24, 60*60
          [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
          [604800, 'days', 86400], // 60*60*24*7, 60*60*24
          [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
          [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
          [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
          [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
          [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
          [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      ];

      var index = 0;
      var format = timeFormats[index];

      var seconds = (+new Date() - time) / 1000;
      var token = 'ago';

      var currentDate = new Date();

      var monthDiff;

      if (seconds === 0) {
        return 'Just now';
      }

      if (seconds > 172800) {
        date.setHours(0, 0, 0);
        seconds = (+new Date() - date.getTime()) / 1000;
      }

      if (seconds > 2419200 && seconds < 58060800) {
        monthDiff = currentDate.getMonth() - date.getMonth() +
          (currentDate.getYear() - date.getYear()) * 12;

        if (monthDiff === 1) {
          return 'Last month';
        }

        return monthDiff + ' months ago';
      }

      while (format) {
        if (seconds < format[0]) {
          if (typeof format[2] === 'string') {
            return format[1];
          }

          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }

        index++;
        format = timeFormats[index];
      }

      return time;
    }

    function eachWithIndex(array, iterator) {
      var index;

      for (index = 0; index < array.length; index++) {
        iterator(array[index], index);
      }
    }

    function cloneNodesIntoTimeline(nodes) {
      var byTimeAgo = {};
      var clone;
      var timeAgoForNode;

      eachWithIndex(nodes, function cloneNodeIntoTimeline(node) {
        clone = node.cloneNode(true);
        timeAgoForNode = timeAgo(node.getAttribute('data-date'));
        byTimeAgo[timeAgoForNode] = byTimeAgo[timeAgoForNode] || [];
        byTimeAgo[timeAgoForNode].push(clone);
      });

      return byTimeAgo;
    }

    function buildTimelineEntryList(items) {
      var list = document.createElement('ul');
      list.className = 'fs_timeline-events';

      items.forEach(function appendItem(item) {
        list.appendChild(item);
      });

      return list;
    }

    function buildTimelineNodeForKey(key, timeline) {
      var listItem = document.createElement('li');
      var span = document.createElement('span');

      listItem.className = 'fs_timeline-group';
      span.className = 'fs_timeline-subheader';
      span.appendChild(document.createTextNode(key));
      listItem.appendChild(span);

      listItem.appendChild(buildTimelineEntryList(timeline[key]));

      return listItem;
    }

    function replaceListWithTimeline(list, timeline) {
      var newList = list.cloneNode(false);
      var even = false;
      var timelineNode;

      Object.keys(timeline).forEach(function buildTimelineNode(key) {
        timelineNode = buildTimelineNodeForKey(key, timeline);
        if (even) {
          timelineNode.className = timelineNode.className + '--even';
        }

        newList.appendChild(timelineNode);
        even = !even;
      });


      list.parentNode.replaceChild(newList, list);
    }

    function buildTimeline() {
      var nodes = document.querySelectorAll('[data-date]');
      var list = document.querySelector('#list');
      var timeline = cloneNodesIntoTimeline(nodes);

      replaceListWithTimeline(list, timeline);

      list = null;
    }

    function getOrdinal(n) {
      var s = ['th', 'st', 'nd', 'rd'];
      var v = n % 100;

      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    function formatUTCStringToLocalTime(utcString) {
      var utcTime = new Date(utcString);
      var month = utcTime.toLocaleDateString(undefined, { month: 'short' });
      var day = utcTime.toLocaleDateString(undefined, { day: 'numeric' });
      var year = utcTime.toLocaleDateString(undefined, { year: 'numeric' });

      return month + ' ' + getOrdinal(day) + ' ' + year;
    }

    function formatTimesToLocal() {
      var times = document.querySelectorAll('time');
      var utcString;

      eachWithIndex(times, function formatTimeToLocal(time) {
        utcString = time.getAttribute('datetime');

        time.textContent = formatUTCStringToLocalTime(utcString);
      });
    }

    formatTimesToLocal();
    buildTimeline();
  }
)(document);
