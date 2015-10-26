
//TODO check for temaplte syntax support
S.template.header = function (){
    return  `
                <header class="mdl-layout__header">
                    <div class="mdl-layout__header-row">
                        <div class="mdl-layout-spacer"></div>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable
                             mdl-textfield--floating-label mdl-textfield--align-right">
                            <label class="mdl-button mdl-js-button mdl-button--icon"
                                   for="fixed-header-drawer-exp">
                                <i class="material-icons">search</i>
                            </label>
                            <div class="mdl-textfield__expandable-holder">
                                <input class="mdl-textfield__input" type="text" name="searchbox" id="fixed-header-drawer-exp" />
                            </div>
                        </div>
                    </div>
                </header>
           `;
}

S.template.menu = function (){
    return `
                <div class="mdl-layout__drawer">
                    <span class="mdl-layout-title">Title</span>
                    <nav class="mdl-navigation">
                        <a class="mdl-navigation__link" href="">Link</a>
                        <a class="mdl-navigation__link" href="">Link</a>
                        <a class="mdl-navigation__link" href="">Link</a>
                        <a class="mdl-navigation__link" href="">Link</a>
                    </nav>
                </div>
    `;
}

S.template.inbox = function (){
    return `
                <main class="mdl-layout__content">
                    <div class="page-content">Bonjour</div>
                </main>
        `;
}

S.template.buttons.quickAdd = function (){
    return `
    <button style="position:fixed;bottom:42px;right:42px;" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
        <i class="material-icons">add</i>
    </button>
            `
}
S.template.base = function (){
    return '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">'+
            "\n"+S.template.header()+
            "\n"+S.template.menu()+
            "\n"+S.template.inbox()+
            "\n"+S.template.buttons.quickAdd()+
            '</div>';
}