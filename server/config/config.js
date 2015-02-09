module.exports = {
    development: {
        url: 'http://127.0.0.1:3004/',
        port: 3004,
        db: 'YOUR-MONGODB-URL',
        app: {
            name: 'IntalligentOS',
            contactEmail: '',
            collectionsPrefix: 'nd_',
            customCollectionsPrefix: 'ndcustom_'
        },
        smtp: {
            host: '',
            secureConnection: false,
            port: 25,
            user: '',
            password: ''
        },
        amazon: {
            accessKeyId: "",
            secretAccessKey: "",
            region: "us-east-1",
            bucket: ""
        },
        pagination: {
            itemsPerPage: 10
        }
    },
    production: {
        url: 'http://127.0.0.1:3003/',
        port: 3003,
        db: 'YOUR-MONGODB-URL',
        app: {
            name: 'IntalligentOS',
            contactEmail: '',
            collectionsPrefix: 'nd_',
            customCollectionsPrefix: 'ndcustom_'
        },
        smtp: {
            host: '',
            secureConnection: false,
            port: 25,
            user: '',
            password: ''
        },
        amazon: {
            accessKeyId: "",
            secretAccessKey: "",
            region: "us-east-1",
            bucket: ""
        },
        pagination: {
            itemsPerPage: 10
        }
    }
}