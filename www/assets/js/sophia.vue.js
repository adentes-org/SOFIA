var S = S || {};


S.vue = {
    el: {
        pages: {}
    },
    map: {},
    init: function () {
        S.vue.parse_template();
        S.vue.init_menu();
        S.vue.init_router();
    },
    parse_template: function () {
        for (var i in S.template.pages) {
            S.vue.el.pages[i] = Vue.extend({
                template: S.template.page_wrapper(i, S.template.pages[i]),
                data: S.data.pages[i] || null
            });
            S.vue.map["/" + i] = {name: S.tool.capitalizeFirstLetter(i), component: S.vue.el.pages[i]};
        }
    },
    init_router: function () {
        S.vue.el.App = Vue.extend({});
        S.vue.router = new VueRouter();
        S.vue.router.map(S.vue.map);
        S.vue.router.afterEach(function (transition) {
            console.log('Successfully navigated to: ' + transition.to.path);
            if (S.vue.map[transition.to.path])
                S.vue.el.menu.$set('current', S.vue.map[transition.to.path].name);
        });
        // Redirect certain routes to other routes
        S.vue.router.redirect({
            '/': '/inbox'
        })
        
        S.vue.router.start(S.vue.el.App, '.app');
        $("#menu a.mdl-navigation__link").each(function (id, el) {
            $(el).attr('v-link', $(el).attr('link'));
        });
    },
    init_menu: function () {
        S.vue.el.menu = new Vue({
            el: '#menu',
            data: {current: "Inbox", links: S.vue.map}
        });
        //*
        //*/
    }
};