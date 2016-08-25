// JavaScript Document

(function( $ ) {
  $.fn.revGoalChart = function(options) {

	//default Options
  	this.defaultOptions = {
			height: 150,
			width: 300,
      diameter: 100,
      duration: 1000,
		};
	//combining the default options with the user inputed options
	options = $.extend({}, this.defaultOptions, options);

  let revenue = this.data('info').revenue;
  let goal = this.data('info').goal;
  let percent = Math.round(revenue / goal * 100);
  let formatMoney = d3.format('$,.2f');
  let chart = d3.select(this.get(0))
      .append('svg');

  let arc = d3.svg.arc()
      .innerRadius(options.diameter / 2 * .9)
      .outerRadius(options.diameter / 2);

  let bgArc = d3.svg.arc()
      .innerRadius(options.diameter / 2 * .9)
      .outerRadius(options.diameter / 2)
      .startAngle(0)
      .endAngle(2*Math.PI);

  let pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d;
      });

  let classes = d3.scale.ordinal()
      .range([
          "color-pie",
          "color-bg",
      ]);

  chart.append('path')
      .attr('transform', 'translate(' + (options.width - options.diameter/2) + ',' + options.height/2 + ')')
      .attr('d', bgArc)
      .attr('class', 'color-bg');

  let chart_g = chart.append('g')
      .attr('class', 'pie')

  let rev_goal_g = chart.append('g')
      .attr('class', 'rev-goal');

  chart.append('line')
      .attr('x1', '185')
      .attr('x2', '0')
      .attr('y1', options.height/2)
      .attr('y2', options.height/2)
      .attr('class', 'devider');

  rev_goal_g.append('text')
      .attr('class', 'revenue-label')
      .text('Quarterly Revenue');

  rev_goal_g.append('text')
      .attr('class', 'goal-label')
      .text('Quarterly Goal');

  rev_goal_g.selectAll('.revenue')
      .data([revenue])
      .enter()
      .append('text')
      .attr('class', 'revenue')
      .transition().duration(options.duration)
      .tween('text', function(d){
          var i = d3.interpolate(0, d);
          return function(t){
            d3.select(this).text(formatMoney(i(t)));
          }
      });

  rev_goal_g.selectAll('.goal')
      .data([goal])
      .enter()
      .append('text')
      .attr('class', 'goal')
      .text(formatMoney(goal));
      // .transition().duration(options.duration)
      // .tween('text', function(d){
      //     var i = d3.interpolate(0, d);
      //     return function(t){
      //       d3.select(this).text(formatMoney(i(t)));
      //     }
      // });

  let percent_g = chart.selectAll('svg')
      .data([percent])
      .enter().append('g')
      .attr('class', 'percent')
      .attr('transform',
            'translate(:left, :top)'
            .replace(':left', options.width - options.diameter/2)
            .replace(':top', options.height/2))
      .append('text')
      .transition().duration(options.duration)
      .tween('text', function(d){
          var i = d3.interpolate(0, d);
          return function(t){
            let format = d3.format('.0f');
            d3.select(this).text(format(i(t)) + '%');
          }
      });

  chart_g.selectAll('path')
      .data(pie([percent, 100-percent]))
      .enter().append('path')
      .attr('transform', 'translate(' + (options.width - options.diameter/2) + ',' + options.height/2 + ')')
      .attr('d', arc)
      .attr('class', function(d, i){
          return classes(i);
      })
      .transition().duration(options.duration).ease('bounce')
      .attrTween('d', function(d) {
          var i = d3.interpolate(d.startAngle, d.endAngle);
          return function(t) {
              d.endAngle = i(t);
              return arc(d);
          }
      });



  };
})( jQuery );
