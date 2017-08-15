const React = require('react');

const Download = ({
  progress,
  downloading,
  path,
  name,
  onOpen,
  onClear,
  error,
  index
}) => {
  let openLink = <span className='attachment-link' onClick={() => onOpen(path)}>Show in directory</span>;
  let clearButton = <button className='round small flat material-icons' onClick={() => onClear(index)}>clear</button>;
  let status = downloading ? 'Downloading' : 'Complete';
  if (error) {
    status = 'Error';
  }
  return (
    <li>
      <div className='attachment-name'>{name}</div>
      <div className='progress-bar'>
        <div className='bar' style={{width: `${progress}%`}} />
      </div>
      <div className='status'><span className={status.toLowerCase()}>{status}</span><span className='delimiter' />{!downloading && progress === 100 ? openLink : null}</div>
      {!downloading ? clearButton : null}
    </li>
  );
};

const DownloadManager = ({
  downloads,
  onOpenAttachment,
  onClearDownload,
  onClearAll
}) => {
  let show = downloads.size !== 0;
  downloads = downloads.map(download => (
    <Download
      key={download.get('index')}
      progress={download.get('progress')}
      downloading={download.get('downloading')}
      name={download.get('name')}
      path={download.get('path')}
      index={download.get('index')}
      error={download.get('error')}
      onOpen={onOpenAttachment}
      onClear={onClearDownload}
    />
  ));
  return (
    <div className={`download-manager box ${show ? 'show' : 'hide'}`}>
      <h2>Downloads</h2>
      <span className='clear-all' onClick={onClearAll}>Clear all</span>
      <ul>
        {downloads}
      </ul>
    </div>
  );
};

module.exports = DownloadManager;
