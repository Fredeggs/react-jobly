import WebViewer from '@pdftron/webviewer'

WebViewer({
  path: '/public/webviewer',
  licenseKey: 'YOUR_LICENSE_KEY',
}, document.getElementById('viewer'))
  .then(instance => {
    const { UI, Core } = instance;
    const { documentViewer, annotationManager, Tools, Annotations } = Core;
    // call methods from UI, Core, documentViewer and annotationManager as needed

    documentViewer.addEventListener('documentLoaded', () => {
      // call methods relating to the loaded document
    });

    instance.UI.loadDocument('https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf');
  })