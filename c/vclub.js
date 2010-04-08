/**
 * Video Club modile.
 */
_debug('1!!!!!!!!!!!!!!');
(function(){
    
    stb.ajax_loader = 'http://bb2.sandbox/stalker_portal/server/load.php'
    
    /* VCLUB */
    function vclub_constructor(){
            
        this.row_blocks  = ['hd', 'sd', 'fav', 'lock', 'name', 'today', 'yestarday', 'week_and_more'];
        
        this.load_params = {
            'type'   : 'vod',
            'action' : 'get_ordered_list'
        };
        
        this.superclass = Layer.prototype;
        
        this.category_alias = '';
        
        this.sort_menu = {};
        
        this.search_box = {};
        
        this.view_menu = {};
        
        this.row_callback_timer;
        this.row_callback_timeout = 1000;
        
        this.load_genres = function(alias){
            
            alias = alias || '';
            
            _debug('vclub.load_genres', alias);
        
            stb.load(
                {
                    "type"      : "vod",
                    "action"    : "get_genres_by_category_alias",
                    "cat_alias" : alias
                },
                function(result){
                    _debug('callback categories');
    
                    this.sidebar.fill_items("genre", result);
                },
                this
            )
        };
        
        this.load_years = function(category_id){
            _debug('vclub.load_years');
            
            stb.load(
                {
                    "type"     : "vod",
                    "action"   : "get_years",
                    "category" : category_id
                },
                function(result){
                    _debug('callback years');
    
                    this.sidebar.fill_items("years", result);
                },
                this
            )
        };
        
        this.load_abc = function(){
            _debug('vclub.load_abc');
            
            stb.load(
                {
                    "type"   : "vod",
                    "action" : "get_abc"
                },
                function(result){
                    _debug('callback abc');
                    
                    this.sidebar.fill_items("abc", result);
                },
                this
            )
        };
        
        this.show = function(category){
            
            _debug('vclub.show');
            
            this.load_params['category'] = category.id;
            
            try{
                this.sort_menu.action();
                
                this.superclass.show.apply(this);
                
                this.load_abc();
                this.load_genres(category.alias);
                this.load_years(category.id);
            }catch(e){
                _debug(e);
            }
        };
        
        this.hide = function(){
            
            _debug('vclub.hide');
            
            this.search_box && this.search_box.reset && this.search_box.reset();
            
            this.superclass.hide.apply(this);
        };
        
        this.init_sort_menu = function(map, options){
            this.sort_menu = new bottom_menu(this, options);
            this.sort_menu.init(map);
            this.sort_menu.bind();
        };
        
        this.sort_menu_switcher = function(){
            if (this.sort_menu && this.sort_menu.on){
                this.sort_menu.hide();
            }else{
                this.sort_menu.show();
            }
        };
        
        this.init_search_box = function(options){
            this.search_box = new search_box(this, options);
            this.search_box.init();
            this.search_box.bind();
        };
        
        this.search_box_switcher = function(){
            if (this.search_box && this.search_box.on){
                this.search_box.hide();
            }else{
                this.search_box.show();
            }
        };
        
        this.init_view_menu = function(map, options){
            this.view_menu = new bottom_menu(this, options);
            this.view_menu.init(map);
            this.view_menu.bind();
        };
        
        this.view_switcher = function(){
            if (this.view_menu && this.view_menu.on){
                this.view_menu.hide();
            }else{
                this.view_menu.show();
            }
        };
        
        this.fill_short_info = function(item){
            _debug('fill_short_info');
            
            //item.name
            //item.o_name
            //item.year
            //item.director
            //item.screenshot_uri
            //item.genres_str
            
            this.short_info_box.innerHTML = '<span>Жанр: </span>' + item.genres_str + '<br><span>Год: </span>' + item.year + ' <span>Время: </span>' + item.time + ' мин.<br><span>Режиссер: </span>' + item.director;
            this.screenshot_box.innerHTML = '<img src="' + item.screenshot_uri + '" width="240" height="320">';
        };
        
        this.init_short_info = function(){
            this.info_box = create_block_element('', this.main_container);
            
            this.short_info_box = create_block_element('vclub_info_box', this.info_box);
            this.screenshot_box = create_block_element('vclub_screenshot_box', this.info_box);
        };
        
        this.shift_row_callback = function(item){
            
            window.clearTimeout(this.row_callback_timer);
            
            var self = this;
            
            this.row_callback_timer = window.setTimeout(function(){
                
                self.fill_short_info(item);
                
            },
            this.row_callback_timeout);
        };
        
        this.set_middle_container = function(){
            
            this.superclass.set_middle_container.apply(this);
            
            this.fill_short_info(this.data_items[this.cur_row]);
            
        };
        
        this.handling_block = function(data, row_items, block_name){
        
            var passive_blocks = ['today_block', 'yestarday_block', 'week_and_more_block'];
            var active_blocks  = ['active_today_block', 'active_yestarday_block', 'active_week_and_more_block'];
            
            var block_obj = row_items[block_name+'_block']
        
            if (data == '1'){
                if (block_obj.isHidden()){
                    block_obj.show();
                }
            }else if (data == '0' || typeof(data) == "undefined"){
                if (!block_obj.isHidden()){
                    block_obj.hide();
                    
                    if (passive_blocks.indexOf(block_obj.className) >= 0){
                        row_items['name_block'].style.marginRight = '0';
                    }else if (active_blocks.indexOf(block_obj.className) >= 0){
                        row_items['name_block'].style.marginRight = '25px';
                    }
                }
            }else{
                if (block_obj.isHidden()){
                    block_obj.show();
                    
                    if (passive_blocks.indexOf(block_obj.className) >= 0){
                        row_items['name_block'].style.marginRight = '150px';
                    }else if (active_blocks.indexOf(block_obj.className) >= 0){
                        row_items['name_block'].style.marginRight = '175px';
                    }
                    
                }
                block_obj.innerHTML = data;
            }
        };
        
        this.init_info = function(){
            this.info = new vclub_info(this);
            this.info.init();
            this.info.show.bind(key.LEFT, this);
            this.info.bind();
            
            this.full_info_switch.bind(key.RIGHT, this);

            var color_buttons = this.buttons_bar.cloneNode(true);
            
            color_buttons.addClass('disabled_all_buttons');
            
            this.info.dom_obj.appendChild(color_buttons);
        };
        
        this.full_info_switch = function(){
            _debug('full_info_switch');
            
            if (this.info && this.info.on){
                this.on = true;
                this.info.hide();
            }else{
                this.on = false;
                this.info.show(this.data_items[this.cur_row]);
            }
        };
    }
    _debug('step 1');
    vclub_constructor.prototype = new Layer();
    _debug('step 2');
    var vclub = new vclub_constructor();
    _debug('step 3');
    vclub.bind();
    vclub.init();
    _debug('step 4');
    vclub.init_short_info();
    _debug('step 5');
    vclub.set_wide_container();
    _debug('step 6');
    vclub.init_left_ear('ears_back');
    vclub.init_right_ear('ears_movie');
    _debug('step 7');
    vclub.init_color_buttons([
        {"label" : "ОТОБРАЖЕНИЕ", "cmd" : vclub.view_switcher},
        {"label" : "СОРТИРОВКА", "cmd" : vclub.sort_menu_switcher},
        {"label" : "ПОИСК", "cmd" : vclub.search_box_switcher},
        {"label" : "ВЫБОРКА", "cmd" : vclub.sidebar_switcher}
    ]);
    
    vclub.init_info();
    
    vclub.init_sidebar();
    
    vclub.sidebar.init_items("abc", {"header" : "ПО БУКВЕ", "width" : 26, "align" : "center"});
    vclub.sidebar.init_items("genre",  {"header" : "ПО ЖАНРУ", "width" : 95});
    vclub.sidebar.init_items("years",  {"header" : "ПО ГОДУ", "width" : 35});
    
    vclub.sidebar.bind();
    
    vclub.init_sort_menu(
        [
            {"label" : "по имени", "cmd" : function(){this.parent.load_params.fav = false; this.parent.load_params.sortby = 'name'}},
            {"label" : "по добавлению", "cmd" : function(){this.parent.load_params.fav = false; this.parent.load_params.sortby = 'added'}},
            {"label" : "по популярности", "cmd" : function(){this.parent.load_params.fav = false; this.parent.load_params.sortby = 'top'}},
            {"label" : "только избранное", "cmd" : function(){this.parent.load_params.sortby = 'name'; this.parent.load_params.fav = true}}
        ],
        {
            "offset_x" : 217
        }
    );
    
    vclub.init_search_box(
        {
            "offset_x" : 323
        }
    );
    
    vclub.init_view_menu(
        [
            {"label" : "список", "cmd" : function(){this.parent.set_wide_container()}},
            {"label" : "список с инфо", "cmd" : function(){this.parent.set_middle_container()}}
        ],
        {
            "offset_x" : 27,
            "need_reset_load_data" : false,
            "need_update_header"   : false
        }
    );
   
    vclub.init_header_path('ВИДЕО КЛУБ');
    
    vclub.sidebar.dependency    = [vclub.sort_menu, vclub.search_box, vclub.view_menu];
    vclub.sort_menu.dependency  = [vclub.sidebar, vclub.search_box, vclub.view_menu];
    vclub.search_box.dependency = [vclub.sidebar, vclub.sort_menu, vclub.view_menu];
    vclub.view_menu.dependency  = [vclub.sidebar, vclub.sort_menu, vclub.search_box]
    
    vclub.hide();
    
    module.vclub = vclub;
    /* END VCLUB */
    
    /* Integrate vclub in main menu */
    stb.load(
        {
            "type"   : "vod",
            "action" : "get_categories"
        },
        function(result){
            _debug('callback categories');
            
            var categories = result;
            
            var map = [];
    
            for(var i=0; i<categories.length; i++){
                map.push(
                
                {
                    "title" : categories[i].title,
                    "cmd"   : (function(category){
                        
                        
                        return function(){
                            _debug('alias', category.alias);
                        
                            main_menu.hide();
                            module.vclub.show(category);
                        }
                        
                    })(categories[i]),
                }
                
                );
            }
            
            main_menu.add('ВИДЕОКЛУБ', map);
        },
        this
    )
    
})();
_debug('2!!!!!!!!!!!!!!');