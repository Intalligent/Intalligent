module.exports = function (app) {
    var ActionPlans = require('./controller.js');

    /* ActionPlans */
    app.get('/api/custom/ActionPlans/find-all', restrict, ActionPlans.ActionPlansFindAll);
    app.get('/api/custom/ActionPlans/find-all-by-employee', restrict, ActionPlans.ActionPlansFindAllByEmployee);
    app.get('/api/custom/ActionPlans/find-incomplete-by-employee', restrict, ActionPlans.ActionPlansFindIncompleteByEmployee);
    app.get('/api/custom/ActionPlans/find-one', restrict, ActionPlans.ActionPlansFindOne);
    app.post('/api/custom/ActionPlans/create', restrict, ActionPlans.ActionPlansCreate);
    app.post('/api/custom/ActionPlans/update/:id', restrict, ActionPlans.ActionPlansUpdate);
    app.post('/api/custom/ActionPlans/delete/:id', restrict, ActionPlans.ActionPlansDelete);
}

