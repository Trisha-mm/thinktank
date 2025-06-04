import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUBZBVAdmTQaPx\nCHYfoot9rpz52OqTRI5HeeZ93z9gsO+RJ+Bp5KppmrHp7EN4dBC2FonIhTCiB9iP\naaVxIHoAaMZKAujn1O3vwSbu3I9IOUjjKRf95mENvOgIOsJd5M2aLHWyvQO2nNHu\nHIjzLwCNup/VRBMUZSUiuzeRVIJ5tTKSdDvl0ZbFnJJrv3UiEsZIFkn/rl3C/EL0\nX+n8cuKZoXV5SbCYSPcTBdCt2DySl4al6aJmgPB9+KrMQ/SyojhNjy4I8OEObwuT\nR0YXxJoB5qQ6WkcidYSb56Cv77iIM9Og8VFZxoF308+9Rkn0JWiChDpEpi/n/erO\nmX7evI/TAgMBAAECggEAF0vZNQ3z+zMuMVDNseIpU5D5HJbSB4Zz37SsN85s51Hp\nsNhh1yDR/LKLs/lK3JRcNbW6Q/cmhdc422EvVYPNA/h/OSiisL57umlNvtcrQzNQ\nJ+2e/j3vEhRcpnLWYny+fp89+3q7SrhmdLRb8+SJOgl0gHlvY0FN2Egb7fMMNxUX\nkBanr1b+EZyQarTj3+azG61Bepwpl0rP1Rk4DdqLOtxhg6eEcDziL8LoFOaKHBAZ\ndL2AycyBioMsJV8nlobyWMHE9E/FbMOKFU0laslavUvHwuifyuzpOKmaIXUqHZD1\n2NKCnGrTlDknf8I80/lezUhRvOv/aarnMW4NLQDTEQKBgQDzA+lbJIX+Esw966J2\nZ/0PAfsJJOIIIST3vg1ZSFZSrZDP4QXSKROKIvh0zCnGOH0yDIS0VhQOitUnu/SS\nBm3ZYLodGPmoMOTomMSvDRALofZfFUMCBGSLVu7Xq0YUJBgusgCbnpQgtUQL5soR\nFVxobrclXzG9gwViCnrG3CrGGwKBgQDfWbTfDH8PKs9nnfcBnSlpHsZIJbdRIvto\nprtT1pwmgApgaXq4Xk+KR5MSA6VTUC1Cr/hpITHbQ/2ywNgCBZhqK27MG8YZvVT+\ncCysln+aQtb0vY3FVDht/0yDqCZDIlYuc2y7B+ZDpGyUapk16XqVZvw4lJ9GAOuQ\nLzCUR5vYqQKBgQCyhV0YJ2yHiSehFUjz0tCEBeB0hzPE5RRTKrqDrDA97GNFUvkD\nukkwYSBELPdDNpxB+BBEqjdxt2t/FQRFgZOQ7Q3L8lz0wXZnqFJUhjQTV5e1odjn\n0nJKKkKrDJcelKVvKDRqHcSTgpXKaHBovFh2H19LhPL1VRrPOwOWsoZ5oQKBgQCv\nG1Cf0tdG1+R1szX1sPbHcJY5+D/pv8hlutqBF2+jC52XCvto0p//pK/cXrleQSzK\n7NWP7rN82ahsXZ68rxBYpKagJWJBydt6BA4yXWe7VI3coUQmIip/qrmdOtaMqb3x\nexMS61WPULjD/3MQ/nTZ7zztSzA4HP6SMz0d86puyQKBgBscBQH9K8V8I99opQDI\nc+XI2ci+77Wn4dSoNoCEx5W4kVyn69wnqAjWNWIumljcImgJmSQywhzzZ7r9Jocl\n4dZq8sI8wdCatgafw5pRL8tEQBtvT0t1CbcfWozXWPoObBBYRYvTDwPcpYvEhAol\n1qpF4cHmJwdFDp+vh3eGLUd0',
  authDomain: 'think-tank-82fec.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'think-tank-82fec',
  storageBucket: 'think-tank-82fec.appspot.com',
  messagingSenderId: 'sender-id',
  appId: '1:938577551494:ios:d223ac683f3e7af5767107',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
