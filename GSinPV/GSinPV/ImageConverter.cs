using System;
using System.Globalization;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Media.Imaging;

namespace GSinPV
{
    public class ImageConverter : IValueConverter
    {

        public object Convert(object value,
                                System.Type targetType,
                                object parameter,
                                CultureInfo culture)
        {
            BitmapImage img = new BitmapImage();

            if (value != null)
            {
                if (value.ToString() != string.Empty)
                {
                    if (value.ToString() == "/images/company_factory_large.png")
                    {
                        img.UriSource = new Uri(@"https://getsatisfaction.com/images/company_factory_large.png", UriKind.Absolute);
                    }
                    else
                    {
                        img.UriSource = new Uri(value.ToString(), UriKind.Absolute);
                    }
                }
            }

            return img;
        }

        public object ConvertBack(object value,
                                    System.Type targetType,
                                    object parameter,
                                    CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
