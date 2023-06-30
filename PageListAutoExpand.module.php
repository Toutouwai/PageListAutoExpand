<?php namespace ProcessWire;

class PageListAutoExpand extends WireData implements Module, ConfigurableModule {

	/**
	 * Construct
	 */
	public function __construct() {
		parent::__construct();
		$this->delay = 1000;
	}

	/**
	 * Ready
	 */
	public function ready() {
		$config = $this->wire()->config;
		$info = $this->wire()->modules->getModuleInfo($this->className);
		$version = $info['version'];
		// JS config data
		$config->js($this->className, ['delay' => $this->delay]);
		// Add assets
		$config->scripts->add($config->urls->{$this} . "$this.js?v=$version");
	}

	/**
	 * Config inputfields
	 *
	 * @param InputfieldWrapper $inputfields
	 */
	public function getModuleConfigInputfields($inputfields) {
		/** @var InputfieldInteger $f */
		$f = $this->wire()->modules->get('InputfieldInteger');
		$f_name = 'delay';
		$f->name = $f_name;
		$f->label = $this->_('Delay');
		$f->description = $this->_('The next page adjacent to the move placeholder will be automatically expanded after this time delay (milliseconds).');
		$f->inputType = 'number';
		$f->min = 0;
		$f->value = $this->$f_name;
		$inputfields->add($f);
	}

}
