import moment from "moment"

export default function useCommonsStore() {

    const classLevelList = () => {
         return   [
                'Kindergarten',
                'Primary',
                'Secondary',
                'Vocational',
                'Tertiary'
            ]

    }

    const loadGoogleAdsScript = () => {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        document.head.appendChild(script);
    };



   function onlyNumberValidator(event) {
        if (!/[+-/*()\d]/.test(event.key)) return event.preventDefault();
    }

    function numbersOnlyValidator(event) {
        const validChars = /^[0-9+\-*/.\s]+$/;
        if (!validChars.test(event.key)) return event.preventDefault();
    }



    function getOrdinalDate(date = null, split = true) {
        if (date == null) {
            date = new Date();
        } else {
            date = new Date(date);
        }
        //Returns 1st January 2020
        return  moment(date).format("Do MMMM YYYY");
    }

   function getAgeFromDateOfBirth(dateOfBirth) {
        return moment().diff(dateOfBirth
          , "years", false);
      }



     const initializePdfData = (
        fileName = "no content",
        html = " <div style='margin-left: 40px;margin-right: 40px'><h2 style='text-align: center'>" +
        "Document can't be generated for download  " +
        "</h2> <br/> " +
        "<p style='color: #343434; text-align: center'> You haven't filled out some fields on this form ,refresh the page and make sure you have filled all the fields " +
        "if this persits please contact support</p>" +
        "</div>",
        options = {
            "format": "A4",
            "orientation": "portrait",
            "header": {
                "height": "5mm",
                //"contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
            },
            "footer": {
                "height": "10mm",
                "contents": {
                    default: '<small style="color: #444; font-size: 8px; width: 100%; text-align:right"><i>Page {{page}} of  {{pages}}</i></small>', // fallback value
                }
            },
        }
    ) => {
        let htmlWithFormatting = "<html><head> <meta charset=\"utf-8\" /></head><body>"+html+" </body> </html>"
        return { "html": htmlWithFormatting, "options": options, "fileName": fileName };
    }

    return {
        loadGoogleAdsScript,
        classLevelList,
        onlyNumberValidator,
        numbersOnlyValidator,
        getOrdinalDate,
        getAgeFromDateOfBirth,
        initializePdfData,

    }
}
