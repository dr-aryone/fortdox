const React = require('react');

const Download = ({
  progress,
  downloading,
  path,
  name,
  onOpen,
  onClear,
  error,
  id
}) => {
  let openLink = (
    <span key='2' className='attachment-link' onClick={() => onOpen(path)}>
      Show in directory
    </span>
  );
  let clearButton = (
    <button
      className='round small flat material-icons'
      onClick={() => onClear(id)}
    >
      clear
    </button>
  );
  let status = downloading ? 'Downloading' : 'Complete';
  if (error) {
    status = 'Error';
  }
  return (
    <li>
      <div className='attachment-name'>{name}</div>
      <div className='progress-bar'>
        <div className='bar' style={{ width: `${progress}%` }} />
      </div>
      <div className='status'>
        <span className={status.toLowerCase()}>{status}</span>
        {!downloading && progress === 100
          ? [<span key='1' className='delimiter' />, openLink]
          : null}
      </div>
      {!downloading ? clearButton : null}
    </li>
  );
};

const DownloadManager = ({
  downloads,
  show,
  onOpenAttachment,
  onClearDownload,
  onClearAll,
  onClose
}) => {
  downloads = downloads.map(download => (
    <Download
      key={download.get('id')}
      progress={download.get('progress')}
      downloading={download.get('downloading')}
      name={download.get('name')}
      path={download.get('path')}
      id={download.get('id')}
      error={download.get('error')}
      onOpen={onOpenAttachment}
      onClear={onClearDownload}
    />
  ));
  return (
    <div className={`download-manager box ${show ? 'show' : 'hide'}`}>
      <h2>Downloads</h2>
      <div className='dm-controls'>
        <span className='clear-all' onClick={onClearAll}>
          Clear all
        </span>
        <span key='1' className='delimiter' />

        <span className='close' onClick={onClose}>
          Close
        </span>
      </div>
      <ul>{downloads}</ul>
    </div>
  );
};

module.exports = DownloadManager;
