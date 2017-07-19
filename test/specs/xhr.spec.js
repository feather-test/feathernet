
// describe('xhr', () => {
//
//     describe('intercepts xhr when installed', () => {
//
//         describe('has a default response', (expect, done) => {
//             let testUrl = 'http://noresponse.com';
//
//             let r = new XMLHttpRequest();
//             r.onreadystatechange = function () {
//                 if (r.readyState === 4) {
//                     if (r.status === 200) {
//                         expect(text).toBe(void 0);
//                     } else {
//                         expect('response from ' + testUrl).toBe(200);
//                     }
//                     done();
//                 }
//             };
//             r.open('GET', url, true);
//             r.send();
//         });
//
//     });
//
// });

/*
let r = new XMLHttpRequest();

r.onreadystatechange = function () {
    if (r.readyState === 4) {
        if (r.status === 200) {
            expect(text).toBe(void 0);
        } else {
            expect('response from ' + testUrl).toBe(200);
        }
        done();
    }
};

r.open('GET', url, true);

r.withCredentials = true;

r.ontimeout = function () {
    reject(new RequestError('FetchPoly: Request to /' + servlet + ' timed out', servlet));
};

r.onerror = function (e) {
    reject(new RequestError('FetchPoly: Request to /' + servlet + ' failed; ' + e.message, servlet));
};

r.onprogress = function () {
    // set as empty fn to prevent bugs
};

r.onload = function() {
    if (!responseHandled) {
        responseHandled = true;
        handleResponse({
            text: r.responseText,
            servlet: servlet,
            url: url,
            resolve: resolve,
            reject: reject
        });
    }
};

r.send();
*/
