# -*- encoding: utf-8 -*-
#
# @package koppefest
#
# @file Sinatra handler
# @author Christoph Kappel <christoph@unexist.dev>
# @version $Id$
#
# This program can be distributed under the terms of the GNU GPLv3.
# See the file COPYING for details.
#

require "rubygems"
gem "sinatra", "1.4.8"
require "sinatra"
require "haml"
require "data_mapper"
require "json"

# DatamMpper
DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/koppe.db")

# Config
configure do
  set :port, 11000
  set :server, 'webrick'
end

class Houses
  include DataMapper::Resource

  property :id,             Serial
  property :houseno,        Integer, :unique_index => :index_houseno_u
  property :adultsno,       Integer
  property :childrenno,     Integer
  property :beerbenchsno,   Integer
  property :gardentablesno, Integer
  property :chairsno,       Integer
  property :standtablesno,  Integer
  property :walltablesno,   Integer
  property :tentsno,        Integer
  property :grillsno,       Integer
  property :parasolsno,     Integer
  property :foods,          Text
  property :drinks,         Text
  property :misc,           Text
  property :buildup,        Integer
  property :teardown,       Integer
  property :created_at,     DateTime
end

DataMapper.finalize
Houses.auto_upgrade!

# Routes
get "/" do
  @houses = Houses.all(:order => [ :created_at.desc ])

  @adultsno = 0
  @childrenno = 0
  @beerbenchsno = 0
  @gardentablesno = 0
  @chairsno = 0
  @standtablesno = 0
  @walltablesno = 0
  @tentsno = 0
  @grillsno = 0
  @parasolsno = 0
  @buildup = 0
  @teardown = 0

  @houses.each do |h|
    @adultsno += h.adultsno
    @childrenno += h.childrenno
    @beerbenchsno += h.beerbenchsno
    @gardentablesno += h.gardentablesno
    @chairsno += h.chairsno
    @standtablesno += h.standtablesno
    @walltablesno += h.walltablesno
    @tentsno += h.tentsno
    @grillsno += h.grillsno
    @parasolsno += h.parasolsno
    @buildup += h.buildup
    @teardown += h.teardown
  end

  haml :index
end

post "/visit" do
  begin
    Houses.create(
      houseno: params["houseno"],
      adultsno: params["adultsno"],
      childrenno: params["childrenno"],
      beerbenchsno: params["beerbenchsno"],
      gardentablesno: params["gardentablesno"],
      chairsno: params["chairsno"],
      standtablesno: params["standtablesno"],
      walltablesno:  params["walltablesno"],
      tentsno: params["tentsno"],
      grillsno: params["grillsno"],
      parasolsno: params["parasolsno"],
      foods: params["misc"],
      drinks: params["drinks"],
      misc: params["misc"],
      buildup: params["buildup"],
      teardown: params["teardown"],
      created_at: Time.now
    )
  rescue DataObjects::IntegrityError => err
    halt 400, "Diese Hausnummer wurde schon eingetragen!"
  end

  200
end
