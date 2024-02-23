const limit = 5;
const template = document.getElementById('tab')
const usage = await chrome.runtime.sendMessage({});

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = 2
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB',
                  'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function openTab(evt, name) {
  const content = document.getElementsByClassName("tab-content");
  for (var i = 0; i < content.length; i++) {
    content[i].style.display = "none";
  }

  const links = document.getElementsByClassName("tab-link");
  for (var i = 0; i < links.length; i++) {
    links[i].className = links[i].className.replace(" active", "");
  }

  document.getElementById(name).style.display = "block";
  evt.currentTarget.className += " active";
}

function populateTab(metric, formatter = (m) => m) {
  usage.sort((a, b) => { return b[metric] - a[metric]; });
  const elements = new Set();

  for (const u of usage.slice(0, limit)) {
    const element = template.content.firstElementChild.cloneNode(true);

    const title = u.tab.title.split('-')[0].trim();
    element.querySelector('.title').textContent = title;
    element.querySelector('.usage').textContent = formatter(u[metric]);
    element.querySelector('div').addEventListener('click', async () => {
      await chrome.tabs.update(u.tab.id, { active: true });
    });

    elements.add(element);
  }
  document.getElementById(metric).querySelector('ul').append(...elements);
};

populateTab('cpu', (metric) => metric.toFixed(2) + '%');
populateTab('mem', formatBytes);
populateTab('js', formatBytes);
populateTab('net', formatBytes);

for (const name of ['cpu', 'mem', 'js', 'net']) {
  document.getElementById(name + '-button').addEventListener('click',
    (evt) => openTab(evt, name));
};
