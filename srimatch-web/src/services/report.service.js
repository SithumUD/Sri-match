import API from './base.service';

const ReportService = {
    submitReport: (data) => {
        return API.post('/reports', data);
    }
};

export default ReportService;
