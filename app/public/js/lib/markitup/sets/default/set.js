// ----------------------------------------------------------------------------
// markItUp!
// ----------------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// BBCode tags example
// http://en.wikipedia.org/wiki/Bbcode
// ----------------------------------------------------------------------------
// Feel free to add more tags
// ----------------------------------------------------------------------------
var MarkItUpSettings = {
    resizeHandle: false,
	markupSet: [
		{name:'Жирный', key:'B', openWith:'[b]', closeWith:'[/b]'},
		{name:'Курсив', key:'I', openWith:'[i]', closeWith:'[/i]'},
		{name:'Подчеркнутый', key:'U', openWith:'[u]', closeWith:'[/u]'},
		{separator:'---------------' },
		{name:'Картинка', key:'P', replaceWith:'[img][![Url]!][/img]'},
		{name:'Ссылка', key:'L', openWith:'[url=[![Url]!]]', closeWith:'[/url]', placeHolder:'Your text to link here...'},
		{separator:'---------------' },
		{name:'Маркированный список', openWith:'[list]\n', closeWith:'\n[/list]'},
		{name:'Нумерованный список', openWith:'[list=[![Starting number]!]]\n', closeWith:'\n[/list]'},
		{name:'Элемент списка', openWith:'[*] '},
		{separator:'---------------' },
		{name:'Цитата', openWith:'[quote]', closeWith:'[/quote]'},
		{name:'Код', openWith:'[code]', closeWith:'[/code]'},
		{separator:'---------------' },
		{name:'Очистить', className:"clean", replaceWith:function(markitup) { return markitup.selection.replace(/\[(.*?)\]/g, "") } },
	]
};