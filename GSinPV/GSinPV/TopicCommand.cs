﻿using System;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Controls.Pivot;
using System.Windows.Browser;

namespace GSinPV
{
    public class TopicCommand : IPivotViewerUICommand
    {

        public string TopicUrl { get; set; }

        public string DisplayName
        {
            get { return "Load Topics"; }
        }

        public Uri Icon
        {
            get { return null; }
        }

        public object ToolTip
        {
            get { return "Load Topics "; }
        }

        public bool CanExecute(object parameter)
        {
            return true;
        }

        public event EventHandler CanExecuteChanged;

        public void Execute(object parameter)
        {
            Uri apiToCall = new Uri("https://api.getsatisfaction.com" + TopicUrl + ".json?sort=recently_active&limit=50&page=0&callback=handlerTopics");
            HtmlPage.Window.Invoke("injectScript", apiToCall, "Topics");
        }
    }
}
