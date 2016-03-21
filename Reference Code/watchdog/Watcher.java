import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.LinkedList;
import java.util.Queue;

import javax.swing.AbstractAction;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;

/**
 * The Watcher establishes a socket connection with the NAOBot and fetches
 * images from its camera.
 * 
 * @author Lloyd
 *
 */
public class Watcher extends JFrame implements WindowListener {

	private static final long serialVersionUID = 2736837755338468826L;

	/**
	 * The IP address of the NAOBot
	 */
	private static String NAOQI_IP = "10.100.205.180";

	/**
	 * The port through which to send commands and queries
	 */
	private static int NAOQI_IN_PORT = 3000;

	// private static int NAOQI_OUT_PORT = 3001;

	/**
	 * The image is drawn on this panel
	 * 
	 * @author Lloyd
	 *
	 */
	class Video extends JPanel {

		private static final long serialVersionUID = -7762702597566939084L;

		/**
		 * The pixel array used to update the image
		 */
		int[] pixels;

		/**
		 * The image to hold the camera data
		 */
		BufferedImage bImage;

		/**
		 * Initializes the panel
		 * 
		 * @param width
		 * @param height
		 */
		Video(int width, int height) {
			Watcher.this.width = width;
			Watcher.this.height = height;
			pixels = new int[width * height];
			bImage = new BufferedImage(width, height,
					BufferedImage.TYPE_INT_RGB);
			setMinimumSize(new Dimension(width, height));
			setPreferredSize(new Dimension(width + 50, height + 50));
		}

		/**
		 * Paints the image onto this panel
		 * 
		 * @see javax.swing.JComponent#paint(java.awt.Graphics)
		 */
		public void paint(Graphics g) {
			super.paint(g);
			g.setColor(Color.GREEN);
			g.fillRect(0, 0, getWidth(), getHeight());
			// g.drawImage(image, 25, 25, this);
			g.drawImage(bImage, 25, 25, getWidth() - 50, getHeight() - 50, this);
			g.setColor(Color.WHITE);
			g.drawRect(25, 25, getWidth() - 50, getHeight() - 50);
		}

		/**
		 * Alerts the panel that new image data has been supplied
		 */
		public void newPixels() {
			bImage.setRGB(0, 0, width, height, pixels, 0, width);
			repaint();
		}

		public void updateSize(int width, int height) {
			if (bImage.getWidth() != width || bImage.getHeight() != height) {
				Watcher.this.width = width;
				Watcher.this.height = height;
				bImage = new BufferedImage(width, height,
						BufferedImage.TYPE_INT_RGB);
				pixels = new int[width * height];
			}
		}
	}

	/**
	 * This Runnable queries the NAOBot and sends the image data to the Video
	 * panel.
	 * 
	 * @author Lloyd
	 *
	 */
	class VideoUpdater implements Runnable {

		/**
		 * If the updater should continue querying the NAOBot
		 */
		public boolean running = false;

		@Override
		public void run() {
			// start querying
			running = true;
			while (running) {
				while (!commandQueue.isEmpty()) {
					String com = commandQueue.poll();
					try {
						send(com);
						handleInput(com);
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
				try {
					// send the fetch command
					// the response is the width and height,
					// each three digits long, followed by
					// width * height * 3 bytes of image data
					send("fetch");

					// read width and height
					int width, height;
					char[] str = new char[3];
					str[0] = (char) dataIn.read();
					str[1] = (char) dataIn.read();
					str[2] = (char) dataIn.read();
					width = Integer.parseInt(new String(str));
					str[0] = (char) dataIn.read();
					str[1] = (char) dataIn.read();
					str[2] = (char) dataIn.read();
					height = Integer.parseInt(new String(str));

					// read image data
					byte[] binaryImage = new byte[width * height * 3];
					for (int i = 0; i < binaryImage.length; i += dataIn.read(
							binaryImage, i, binaryImage.length - i))
						;

					// update Video panel with image data
					video.updateSize(width, height);
					for (int i = 0; i < height && i < height; i++)
						for (int j = 0; j < width && j < width; j++)
							video.pixels[i * width + j] = (0xff << 24)
									| ((binaryImage[(i * width + j) * 3 + 0] & 0xff) << 8)
									| ((binaryImage[(i * width + j) * 3 + 1] & 0xff) << 0)
									| ((binaryImage[(i * width + j) * 3 + 2] & 0xff) << 16);
					video.newPixels();
				} catch (Exception e) {
					e.printStackTrace();
				}

				// delay next fetch
				try {
					Thread.sleep(500);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}

			// send disconnect command
			try {
				send("quit");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		public void handleInput(String com) {
			switch (com) {
			case "move-left":
			case "move-up":
			case "move-right":
			case "move-down":
				break;
			}
		}

	}

	/**
	 * This Runnable recieves status messages from the NAOBot
	 * 
	 * @author Lloyd
	 *
	 */
	class TextUpdater implements Runnable {

		/**
		 * If the updater should continue listening the NAOBot
		 */
		boolean running = false;

		public void run() {
			running = true;
			// the array to hold the message and message size
			char[] numArr = new char[3], msgArr = new char[100];
			while (running) {
				try {
					// the size is three digits long
					// the maximum size is 100 characters
					// if a message is longer than 100
					// characters, a size of -1 is sent
					// indicating that the following 100
					// characters are a subset of the
					// full message
					String msg = "";
					int num = -1;
					// continue whil the full message has not been sent
					while (num == -1) {
						// read message size
						numArr[0] = (char) statIn.read();
						numArr[1] = (char) statIn.read();
						numArr[2] = (char) statIn.read();
						num = Integer.parseInt(new String(numArr));
						for (int i = 0; i < (num == -1 ? 100 : num); i++)
							msgArr[i] = (char) statIn.read();
						msg += new String(msgArr, 0, (num == -1 ? 100 : num));
					}

					// append the message to the TextArea
					text.append(msg);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}

	/**
	 * The server for connecting to the second NAOBot connection
	 */
	@SuppressWarnings("unused")
	private ServerSocket server;

	/**
	 * The client socket to the NAOBot
	 */
	private Socket client;

	/**
	 * The server socket to the NAOBot
	 */
	@SuppressWarnings("unused")
	private Socket connection;

	/**
	 * The InputStream for receiving image data
	 */
	private InputStream dataIn;

	/**
	 * The InputStream for receiving status messages
	 */
	private InputStream statIn;

	/**
	 * The OutputStream for sending commands
	 */
	private BufferedWriter comOut;

	/**
	 * The width of the image
	 */
	private int width = 320;

	/**
	 * The height of the image
	 */
	private int height = 240;

	/**
	 * The panel for displaying the images
	 */
	private Video video;

	/**
	 * The Runnable for querying the NAOBot
	 */
	private VideoUpdater updater;

	/**
	 * The Thread for querying the NAOBot
	 */
	private Thread updaterThread;

	/**
	 * The TextArea for displaying status messages
	 */
	private JTextArea text;

	/**
	 * The Runnable for listening for status messages
	 */
	@SuppressWarnings("unused")
	private TextUpdater tupdater;

	/**
	 * The Thread for listening for status messages
	 */
	@SuppressWarnings("unused")
	private Thread tUpdaterThread;

	/**
	 * A Queue for commands to send to the NAOBot by the updater thread
	 */
	private Queue<String> commandQueue;

	/**
	 * Sets up user interface elements
	 */
	public Watcher() {
		super("Watchdog");
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		setExtendedState(MAXIMIZED_BOTH);
		JPanel center = new JPanel(new BorderLayout());
		add(center, BorderLayout.CENTER);
		center.add(video = new Video(width, height),
				BorderLayout.CENTER);
		center.add(new JButton(new AbstractAction("Turn Left") {

			private static final long serialVersionUID = -4660546049008250510L;

			@Override
			public void actionPerformed(ActionEvent e) {
				commandQueue.add("move-left");
			}
		}), BorderLayout.WEST);
		center.add(new JButton(new AbstractAction("Turn Up") {

			private static final long serialVersionUID = -4660546049008250510L;

			@Override
			public void actionPerformed(ActionEvent e) {
				commandQueue.add("move-up");
			}
		}), BorderLayout.NORTH);
		center.add(new JButton(new AbstractAction("Turn Right") {

			private static final long serialVersionUID = -4660546049008250510L;

			@Override
			public void actionPerformed(ActionEvent e) {
				commandQueue.add("move-right");
			}
		}), BorderLayout.EAST);
		center.add(new JButton(new AbstractAction("Turn Down") {

			private static final long serialVersionUID = -4660546049008250510L;

			@Override
			public void actionPerformed(ActionEvent e) {
				commandQueue.add("move-down");
			}
		}), BorderLayout.SOUTH);
		JScrollPane scroll = new JScrollPane(text = new JTextArea());
		scroll.setPreferredSize(new Dimension(3000, 200));
		add(scroll, BorderLayout.SOUTH);
		addWindowListener(this);
		pack();
		setVisible(true);
		commandQueue = new LinkedList<>();
	}

	/**
	 * Sends a message through the command output stream
	 * 
	 * @param msg
	 * @throws IOException
	 */
	public void send(String msg) throws IOException {
		// send the length of the message
		String l = String.format("%03d", msg.length());
		comOut.write(l);

		// send the message
		comOut.write(msg);
		comOut.flush();
		System.out.println("command sent: " + msg);
	}

	/**
	 * Establishes socket connections to the NAOBot
	 * 
	 * @throws UnknownHostException
	 * @throws IOException
	 */
	public void connect() throws UnknownHostException, IOException {
		client = new Socket(NAOQI_IP, NAOQI_IN_PORT);
		dataIn = new BufferedInputStream(client.getInputStream());
		comOut = new BufferedWriter(new OutputStreamWriter(
				client.getOutputStream()));
		updaterThread = new Thread(updater = new VideoUpdater());
		updaterThread.run();
	}

	public static void main(String args[]) throws UnknownHostException,
			IOException {
		Watcher watcher = new Watcher();
		watcher.connect();
	}

	@Override
	public void windowOpened(WindowEvent e) {
	}

	/**
	 * Closes socket connections before exiting
	 * 
	 * @see java.awt.event.WindowListener#windowClosing(java.awt.event.WindowEvent)
	 */
	@Override
	public void windowClosing(WindowEvent e) {
		updater.running = false;
		try {
			updaterThread.join();
		} catch (InterruptedException e2) {
			e2.printStackTrace();
		}
		// tupdater.running = false;
		try {
			comOut.write("quit");
			comOut.close();
			dataIn.close();
			// connection.close();
			// server.close();
			client.close();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	@Override
	public void windowClosed(WindowEvent e) {
	}

	@Override
	public void windowIconified(WindowEvent e) {
	}

	@Override
	public void windowDeiconified(WindowEvent e) {
	}

	@Override
	public void windowActivated(WindowEvent e) {
	}

	@Override
	public void windowDeactivated(WindowEvent e) {
	}
}