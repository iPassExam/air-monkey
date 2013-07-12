$: << './'
require 'optparse'
require 'fileutils'
require 'scms'

options = {}
optparse = OptionParser.new do|opts|
   # Set a banner, displayed at the top
   # of the help screen.
   opts.banner = "Usage: get-gonfig-settings.rb [options]"
  
  opts.on('-c', '--config CONFIG', "YAML config file (full path)") do |c|
    options[:config] = c
  end
  
  opts.on( '-s', '--setting SETTING', 'What setting do you want to get' ) do|s|
    options[:setting] = s
  end
  
  options[:verbose] = false
  opts.on( '-v', '--verbose', 'Output more information' ) do
     options[:verbose] = true
  end
   
   # This displays the help screen, all programs are assumed to have this option.
   opts.on( '-h', '--help', 'Display this screen' ) do
     puts opts
     exit
   end
end
optparse.parse!
#Now raise an exception if we have not found a host option
if options[:config].nil?
	puts "Please specify a website directory" 
	raise OptionParser::MissingArgument 
end

puts "Opening Config:" if options[:verbose]
puts options[:config] if options[:verbose]
$settings = ScmsUtils.getsettings(options[:config])

if options[:setting] != nil
    puts "Getting setting: #{options[:setting]}" if options[:verbose]
    cmd = "$settings"
    options[:setting].split('.').each {|s| 
        cmd += "[\"#{s.strip}\"]"
    }
    
    begin  
      puts eval(cmd)
    rescue Exception => e  
      puts "empty"
    end
end


