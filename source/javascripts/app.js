(
  function frankShowalter(document) {
    function timeAgo(isoTime) {
      var time = +new Date(isoTime);

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
          [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
          [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
      ];

      var index = 0;
      var format = timeFormats[index];

      var seconds = (+new Date() - time) / 1000;
      var token = 'ago';

      if (seconds === 0) {
        return 'Just now';
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

    function cloneNodesIntoTimeline(nodes) {
      var byTimeAgo = {};
      var nodesIndex;
      var clone;
      var timeAgoForNode;

      for (nodesIndex = 0; nodesIndex < nodes.length; nodesIndex++) {
        clone = nodes[nodesIndex].cloneNode(true);
        timeAgoForNode = timeAgo(nodes[nodesIndex].getAttribute('data-date'));

        byTimeAgo[timeAgoForNode] = byTimeAgo[timeAgoForNode] || [];

        byTimeAgo[timeAgoForNode].push(clone);
      }

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

      Object.keys(timeline).forEach(function buildTimelineNode(key) {
        newList.appendChild(buildTimelineNodeForKey(key, timeline));
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

    buildTimeline();
  }
)(document);
