
export default function useCommonsStore() {

    function  removeSpecialCharacters(data) {
        if(data){
            return data.trim().replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').replace(/\s/g, '-').toLowerCase();
        }
    }

  function  abbreviateNumber(value) {
      let newValue = value;
      if (value >= 1000) {
          const suffixes = ["", "k", "m", "b", "t"];
          const suffixNum = Math.floor(("" + value).length / 3);
          let shortValue = '';
          for (let precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum !== 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 !== 0)  shortValue = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }
        return newValue;
    }

   function timeAgo(date){
        let intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        const interval = intervals.find(i => i.seconds < seconds);

        const count = interval ? Math.floor(seconds / interval.seconds) : "";

        return interval ? `${count} ${interval.label}${count !== 1 ? 's' : ''} ago` : "now";

    }


  function  capitalizeString(strg){
        if(strg){
            return ((strg.replace(/\b\w/g, l => l.toUpperCase())).replace(/-/g, " "))
        }
    }

    function tutorViewMetaTags(title, description){

        const meta = {
            title: title,
            meta: [
                {
                    name: description,
                    content: description
                },
                {
                    property: 'og:title',
                    content: title
                },
                {
                    property: 'og:description',
                    content: description
                }
            ]
        }

        document.title = meta.title
        const head = document.querySelector('head')
        if (!head) return

        meta.meta.forEach((tag) => {
            const el = document.createElement('meta')
            Object.entries(tag).forEach(([key, value]) => {
                el.setAttribute(key, value)
            })
            head.appendChild(el)
        })
    }

    const loadGoogleAdsScript = () => {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        document.head.appendChild(script);
    };


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

    function stripTags(value) {

        //this escapes all the html tags such that they can be displayed
        value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        //this converts \n\n to brn codes
        value = value.replace(/\n/g, '<br>')

        //this will highlight code in case its present
        value = value.replace(
            /```([\s\S]*?)```/gm,
            '<code><div class="rounded-3" style="background-color: #222; color: #fff; padding-left: 7px; padding-bottom: 7px;">$1</div></code>'
        );

        return value
    }




/*
    function generateUniqueString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    function generateUniqueKey(minLength, maxLength) {
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        return generateUniqueString(length);
    }*/




    return {
        removeSpecialCharacters,
        abbreviateNumber,
        timeAgo,
        capitalizeString,
        tutorViewMetaTags,
        loadGoogleAdsScript,
        base64ToBinary,
        onlyNumberValidator,
        stripTags,
        // generateUniqueKey
    }
}
