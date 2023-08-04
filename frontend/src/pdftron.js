import {Core, saveByteArray} from '@pdftron/webviewer'

const documentPath = "../frontend/src/jpgs/MOA_template.docx"

export const generatePDF = async function(){
    const newPDF = Core.setWorkerPath('../public/webviewer/core').office2PDFBuffer(documentPath, {
        officeOptions: {
            templateValues: {
                "PHContact": {
                    "email": "v.dado@gmail.com",
                    "firstName": "Veronica",
                    "lastName": "Dado",
                    "phone": "1234567890"
                },
                "USContact": {
                    "email": "a.dauphinais@gmail.com",
                    "firstName": "Asteria",
                    "lastName": "Dauphinais",
                    "phone": "6032646153"
                },
                "admin": {
                    "email": "ian.dauphin@gmail.com",
                    "firstName": "Ian ",
                    "lastName": "Dauphinais",
                    "phone": "6032967085"
                },
                "libraryAddress": {
                    "barangay": "New Barangay",
                    "city": "Chester",
                    "province": "Abra",
                    "region": "Eastern Visayas",
                    "street": "67 Meadow Fox Lane"
                },
                "libraryData": {
                    "libraryName": "New Library Name"
                }
            }
        }
    }).then(buffer => {
        saveByteArray('generated_document.pdf', buffer);
    });

    console.log(newPDF)

}

