import {Core} from '@pdftron/webviewer'

const documentPath = "../frontend/src/jpgs/"

export const generatePDF = async function(){
    const newPDF = Core.office2PDFBuffer(documentPath, {
        officeOptions: {
            templateValues: {
                // keys and values here
            }
        }
    }).then(buffer => {
        saveByteArray('generated_document.pdf', buffer);
    });

    console.log(newPDF)

}

