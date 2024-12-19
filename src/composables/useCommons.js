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

    function base64ToBinary(base64String, filename) {
        let arr = base64String.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n)

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, {type: mime})
    }

   function onlyNumberValidator(event) {
        if (!/[+-/*()\d]/.test(event.key)) return event.preventDefault();
    }

    function numbersOnlyValidator(event) {
        const validChars = /^[0-9.\s]+$/;
        if (!validChars.test(event.key)) return event.preventDefault();
    }


    function codeValidator(event) {
        const validChars = /^[0-9\s]+$/;
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





    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = padZero(date.getUTCMonth() + 1);
        const day = padZero(date.getUTCDate());
        const hour = padZero(date.getUTCHours());
        const minute = padZero(date.getUTCMinutes());
        const second = padZero(date.getUTCSeconds());

        return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
    }


  /*  const  wellFormatedDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }*/




    const    wellFormatedDate = (dateString) => {
            const date = new Date(dateString);

            // Get day, month, and year
            const day = date.getDate();
            const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const year = date.getFullYear();

            // Add ordinal suffix to the day
            const ordinalSuffix = getOrdinalSuffix(day);

            // Return formatted date
            return `${day}${ordinalSuffix} ${month} ${year}`;
        }
        const getOrdinalSuffix = (day) => {
            if (day > 3 && day < 21) return 'th'; // for 11th - 20th
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        }






    const padZero = (value) => {
        return value < 10 ? '0' + value : value;
    }

    const objectToQueryParams = (objectToParse) => {
        return Object.keys(objectToParse).map(key => key + '=' + objectToParse[key]).join('&');
    }

    const formatNumbersWithComma = (value) => {
        if (value != null) {
            return new Intl.NumberFormat().format(value);
        }
        return value;
    }

    const ageCalculator = (dob) => {
        const now = new Date();
        const birthDate = new Date(dob);

        if (isNaN(birthDate)) {
            throw new Error("Invalid date format. Please provide a valid date.");
        }

        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += previousMonth.getDate();
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        let result = "";
        if (years > 0) result += `${years}yrs`;
        if (months > 0) result += result ? `, ${months}mth` : `${months}mth`;
        if (days > 0) result += result ? `, ${days}dys` : `${days}dys`;

        return result || "0dys"; // Return "0dys" if all are zero
    }

    return {
        onlyNumberValidator,
        numbersOnlyValidator,
        codeValidator,
        getOrdinalDate,
        getAgeFromDateOfBirth,
        objectToQueryParams,
        base64ToBinary,
        formatDate,
        initializePdfData,
        wellFormatedDate,
        formatNumbersWithComma,
        ageCalculator
    }
}
