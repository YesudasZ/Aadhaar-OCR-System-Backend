const processBase64Image = (base64String) => {
    const base64Image = base64String.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Image, 'base64');
};

const extractName = (text) => {
    const lines = text.split('\n');
    let name = '';

    for (const line of lines) {
        if (line.toLowerCase().includes('government') ||
            line.toLowerCase().includes('india') ||
            line.toLowerCase().includes('aadhaar') ||
            line.toLowerCase().includes('uid')) {
            continue;
        }
        if (line.match(/^[A-Za-z\s]{2,50}$/)) {
            name = line.trim();
            break;
        }
    }
    return name;
};

const extractPincode = (address) => {
    const pincodeMatch = address.match(/\b\d{6}\b/);
    const pincodeIndex = pincodeMatch ? address.indexOf(pincodeMatch[0]) : -1;

    return {
        pincode: pincodeMatch ? pincodeMatch[0] : '',
        index: pincodeIndex
    };
};

const cleanAddress = (address) => {
    return address
        .replace(/help@uidai\.gov\.in/g, '')
        .replace(/www\.uidai\.gov\.in/g, '')
        .replace(/\b\d{6}\b/g, '')
        .replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, '')
        .replace(/\b1947\b/g, '')
        .replace(/Testing\s*/i, '')
        .replace(/,\s*,+/g, ',')
        .replace(/\s+/g, ' ')
        .replace(/,\s*\./g, '.')
        .replace(/\s*\.\s*$/g, '')
        .replace(/,(\s*,\s*)+/g, ',')
        .replace(/,\s*$/g, '')
        .trim();
};

const formatFinalAddress = (address) => {
    return address
        .split(',')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .join(', ')
        .replace(/\s*\.$/, '')
        + '.';
};

const extractAadhaarDetails = (frontText, backText) => {
    const details = {
        name: '',
        aadhaarNumber: '',
        dob: '',
        gender: '',
        address: '',
        pincode: ''
    };

    const frontLines = frontText.split('\n');
    frontLines.forEach(line => {

        const aadhaarMatch = line.match(/[0-9]{4}\s[0-9]{4}\s[0-9]{4}/);
        if (aadhaarMatch) {
            details.aadhaarNumber = aadhaarMatch[0];
        }

        const dobMatch = line.match(/(\d{2}\/\d{2}\/\d{4})|(\d{2}-\d{2}-\d{4})/);
        if (dobMatch) {
            details.dob = dobMatch[0];
        }

        if (line.toLowerCase().includes('male')) {
            details.gender = line.toLowerCase().includes('female') ? 'FEMALE' : 'MALE';
        }
    });

    details.name = extractName(frontText);

    const backLines = backText.split('\n');
    let addressLines = [];
    let isAddress = false;

    backLines.forEach(line => {
        if (line.toLowerCase().includes('address:') || line.toLowerCase().includes('add:')) {
            isAddress = true;
            line = line.replace(/address:|add:/i, '').trim();
            if (line) addressLines.push(line);
        }
        else if (isAddress && line.trim()) {
            addressLines.push(line.trim());
        }
    });

    if (addressLines.length > 0) {
        let fullAddress = addressLines.join(', ');
        const { pincode } = extractPincode(fullAddress);

        if (pincode) {
            details.pincode = pincode;
        }

        fullAddress = cleanAddress(fullAddress);
        details.address = formatFinalAddress(fullAddress);
    }

    return details;
};

const verifyAadhaarCard = (frontText, backText) => {
    const aadhaarKeywords = ['government', 'india', 'aadhaar', 'uid'];

    const hasAadhaarKeywords = aadhaarKeywords.some(keyword =>
        frontText.toLowerCase().includes(keyword) || backText.toLowerCase().includes(keyword)
    );

    return hasAadhaarKeywords;
};

module.exports = {
    processBase64Image,
    extractAadhaarDetails,
    cleanAddress,
    formatFinalAddress,
    verifyAadhaarCard
};
