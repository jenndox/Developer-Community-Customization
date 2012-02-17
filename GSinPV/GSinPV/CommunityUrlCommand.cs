using System;
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
    public class CommunityURLCommand : IPivotViewerUICommand
    {

        public string LinkUrl { get; set; }

        public string DisplayName
        {
            get { return "Navigate to Community"; }
        }

        public Uri Icon
        {
            get { return null; }
        }

        public object ToolTip
        {
            get { return "Navigate to Community "; }
        }

        public bool CanExecute(object parameter)
        {
            return true;
        }

        public event EventHandler CanExecuteChanged;

        public void Execute(object parameter)
        {
            HtmlPage.Window.Navigate(new Uri("https://www.getsatisfaction.com/" + LinkUrl), "_blank", "height=300,width=600,top=100,left=100");
        }
    }
}
